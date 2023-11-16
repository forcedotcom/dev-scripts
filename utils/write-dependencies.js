/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const PackageJson = require('./package-json');
const { resolveConfig } = require('./sf-config');

/**
 * These are not part of dev-scripts pjson because they depend on dev-scripts and would create a circular dependency
 * But, if the target repo has the dep, we want to make sure it meets the minimum version.
 */
const nonPjsonDependencyMinimums = new Map([
  ['@salesforce/sf-plugins-core', '^5.0.1'],
  ['@salesforce/core', '^6.1.3'],
  ['@salesforce/kit', '^3.0.15'],
  ['@salesforce/ts-types', '^2.0.9'],
  ['@oclif/core', '^2.15.0'],
  ['@salesforce/cli-plugins-testkit', '^4.2.9'],
  ['@salesforce/source-deploy-retrieve', '^10.0.0'],
  ['@salesforce/source-tracking', '^5.0.0'],
  ['@salesforce/plugin-command-reference', '^3.0.25'],
  ['@oclif/plugin-command-snapshot', '^4.0.2'],
  ['eslint-plugin-sf-plugin', '^1.16.15'],
  ['@salesforce/telemetry', '^5.0.0'],
  ['oclif', '^3.16.0'],
]);

const getVersionNum = (ver) => (ver.startsWith('^') || ver.startsWith('~') ? ver.slice(1) : ver);
const meetsMinimumVersion = (pjsonDepVersion, devScriptsDepVersion) => {
  // First remove any carets and tildes
  const pVersion = getVersionNum(pjsonDepVersion);
  const dsVersion =
    getVersionNum(devScriptsDepVersion) ?? getVersionNum(nonPjsonDependencyMinimums.get(pjsonDepVersion));
  // Compare the version in package.json with the dev scripts version.
  // result === -1 means the version in package.json < dev scripts version
  // result === 0 means they match
  // result === 1 means the version in package.json > dev scripts version
  return pVersion.localeCompare(dsVersion, 'en-u-kn-true') > -1;
};

module.exports = (projectPath) => {
  const pjson = new PackageJson(projectPath);

  const config = resolveConfig(projectPath);
  const devDependencies = pjson.get('devDependencies');

  const added = [];
  const removed = [];

  const devScriptsVersion = (name) =>
    devScriptsPjson.dependencies?.[name] ??
    devScriptsPjson.devDependencies?.[name] ??
    nonPjsonDependencyMinimums.get(name);

  const devScriptsPjson = require(join(__dirname, '..', 'package.json'));
  const add = (name, version) => {
    version = version ?? devScriptsVersion(name);
    if (!version) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Version empty for ${name}. Make sure it is in the devDependencies in dev-scripts since it is being added to the actual projects devDependencies.`
      );
    }
    // If the dependency min version has been met, ignore it.
    if (!devDependencies[name] || !meetsMinimumVersion(devDependencies[name], version)) {
      devDependencies[name] = version;
      added.push(name);
    }
  };

  const remove = (name) => {
    if (devDependencies[name]) {
      delete devDependencies[name];
      removed.push(name);
    }
  };

  const scripts = config.scripts;
  const eslintConfigSfTsPjson = require('eslint-config-salesforce-typescript/package.json');

  /** devDeps that *should* be in every repo dev-scripts touches.  */
  const requiredDeps = [];

  /** These packages are provided to orgs via devScripts.  They should not be in the pjson of the consumer
   * If you don't like the devScripts version, you can specify your own in sf-dev-rc.json in the dependencies section.
   */
  const providedByDevScripts = [
    '@commitlint/cli',
    '@commitlint/config-conventional',
    'typedoc-plugin-missing-exports',
    'source-map-support',
    'typedoc',
    'husky',
    'pretty-quick',
    'prettier',
    'nyc',
    'mocha',
    'sinon',
    'chai',
    'wireit',
    '@types/chai',
    '@types/mocha',
    '@types/node',
    '@types/sinon',
    '@salesforce/dev-config',
    '@salesforce/prettier-config',
    // this repo manages all things eslint.  Its dependencies are in dev-scripts and therefore should be omitted
    'eslint-config-salesforce-typescript',
    ...Object.keys(eslintConfigSfTsPjson.dependencies),
    // leave these alone if the project has them
  ].filter((dep) => !new Set(config.devDepOverrides).has(dep));
  /**
   * We don't want these in any repo.  This is a good way to clean up things en masse
   */
  const bannedDeps = ['cz-conventional-changelog', 'lint-staged', 'tslint', 'eslint-plugin-prettier'].concat(
    scripts.format ? [] : ['prettier', '@salesforce/prettier-config']
  );

  // removes go before adds because some are "added back"
  providedByDevScripts.forEach((dep) => remove(dep));
  bannedDeps.forEach((dep) => remove(dep));

  // calling add will force it to exist
  requiredDeps.forEach((dep) => add(dep));

  // look through the target's devDeps and, if devScripts has a min version, apply that
  Object.keys(devDependencies).forEach((dep) => {
    const version = devScriptsVersion(dep);
    if (!bannedDeps.includes(dep) && !requiredDeps.includes(dep) && version) {
      add(dep, version);
    }
  });

  // update any non-devDeps to their minimum versions if devScripts specifies one
  const dependencies = pjson.get('dependencies');
  Object.entries(dependencies).forEach(([dep, depVersion]) => {
    if (nonPjsonDependencyMinimums.has(dep)) {
      const minVersion = nonPjsonDependencyMinimums.get(dep);
      if (!meetsMinimumVersion(depVersion, minVersion)) {
        pjson.actions.push(`updating ${dep} to ${minVersion}`);
        dependencies[dep] = minVersion;
      }
    }
  });

  if (added.length > 0) {
    pjson.actions.push(`added/updated devDependencies ${added.join(', ')}`);
  }

  if (removed.length > 0) {
    pjson.actions.push(`removed devDependencies controlled by dev-scripts, ${removed.join(', ')}`);
  }

  pjson.write();
  return added.length > 0;
};
