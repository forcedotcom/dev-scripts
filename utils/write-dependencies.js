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
  ['@salesforce/sf-plugins-core', '^2.4.2'],
  ['@salesforce/core', '^3.36.0'],
  ['@salesforce/kit', '^3.0.0'],
  ['@salesforce/ts-types', '^2.0.1'],
  ['@oclif/core', '^2.8.2'],
  ['@salesforce/cli-plugins-testkit', '^3.3.4'],
  ['@salesforce/plugin-command-reference', '^2.2.8'],
  ['@oclif/plugin-command-snapshot', '^3.3.13'],
  ['eslint-plugin-sf-plugin', '^1.15.1'],
  ['oclif', '^3.8.2'],
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

  /** devDeps that *should* be in every repo dev-scripts touches.  */
  const requiredDeps = [
    'husky',
    'pretty-quick',
    'nyc',
    'ts-node',
    'mocha',
    'sinon',
    'chai',
    'wireit',
    'eslint-config-salesforce',
    'eslint-config-salesforce-typescript',
    'eslint-config-salesforce-license',
  ].concat(scripts.format ? ['prettier', '@salesforce/prettier-config'] : []);

  /**
   * if dev-scripts sees these in devDeps, they'll be removed
   * some of these are in the devScripts Deps, but we don't want them in the target's devDeps (controlled by devScripts)
   */
  const bannedDeps = [
    '@commitlint/cli',
    '@commitlint/config-conventional',
    'source-map-support',
    'typedoc',
    'cz-conventional-changelog',
    'lint-staged',
    'tslint',
    '@types/chai',
    '@types/mocha',
    '@types/node',
    '@types/sinon',
    'typedoc-plugin-missing-exports',
    'eslint-plugin-prettier',
  ].concat(scripts.format ? [] : ['prettier', '@salesforce/prettier-config']);
  // removes go before adds because some are "added back"
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

  const eslintPjson = require('eslint-config-salesforce-typescript/package.json');
  const eslintHeaderPjson = require('eslint-config-salesforce-license/package.json');

  // eslint and all plugins must be installed on a local basis, regardless of if it uses a shared config.
  // https://eslint.org/docs/user-guide/getting-started
  Object.entries(eslintPjson.devDependencies).forEach(([name, version]) => add(name, version));
  Object.entries(eslintHeaderPjson.devDependencies).forEach(([name, version]) => add(name, version));

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
