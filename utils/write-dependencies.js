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
]);

module.exports = (projectPath) => {
  const pjson = new PackageJson(projectPath);

  const config = resolveConfig(projectPath);
  const dependencies = pjson.get('devDependencies');

  const added = [];
  const removed = [];

  const getVersionNum = (ver) => (ver.startsWith('^') || ver.startsWith('~') ? ver.slice(1) : ver);
  const meetsMinimumVersion = (pjsonDepVersion, devScriptsDepVersion) => {
    // First remove any carets and tildas
    const pVersion = getVersionNum(pjsonDepVersion);
    const dsVersion = getVersionNum(devScriptsDepVersion) ?? nonPjsonDependencyMinimums.get(pjsonDepVersion);
    // Compare the version in package.json with the dev scripts version.
    // result === -1 means the version in package.json < dev scripts version
    // result === 0 means they match
    // result === 1 means the version in package.json > dev scripts version
    return pVersion.localeCompare(dsVersion, 'en-u-kn-true') > -1;
  };

  const devScriptsPjson = require(join(__dirname, '..', 'package.json'));
  const add = (name, version) => {
    version = version || devScriptsPjson.dependencies[name] || devScriptsPjson.devDependencies[name];
    if (!version) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Version empty for ${name}. Make sure it is in the devDependencies in dev-scripts since it is being added to the actual projects devDependencies.`
      );
    }
    // If the dependency min version has been met, ignore it.
    if (!dependencies[name] || !meetsMinimumVersion(dependencies[name], version)) {
      dependencies[name] = version;
      added.push(name);
    }
  };

  const remove = (name) => {
    if (dependencies[name]) {
      delete dependencies[name];
      removed.push(name);
    }
  };

  const scripts = config.scripts;

  add('husky');
  add('pretty-quick');

  if (scripts.format) {
    add('prettier');
  } else {
    remove('prettier');
  }

  // ensure all are on the same versions
  add('typescript');
  add('@salesforce/dev-config');

  // Included by dev-scripts
  add('nyc');
  add('ts-node');
  add('mocha');
  add('sinon');
  add('chai');
  add('wireit');

  remove('@commitlint/cli');
  remove('@commitlint/config-conventional');
  remove('source-map-support');
  remove('@types/chai');
  remove('@types/mocha');
  remove('@types/node');
  remove('@types/sinon');
  remove('typedoc');
  remove('typedoc-plugin-missing-exports');
  remove('eslint-plugin-prettier');
  remove('lint-staged');
  remove('cz-conventional-changelog');
  // We use eslint now
  remove('tslint');

  add('@salesforce/prettier-config');

  const eslintPjson = require('eslint-config-salesforce-typescript/package.json');
  const eslintHeaderPjson = require('eslint-config-salesforce-license/package.json');

  add('eslint-config-salesforce');
  add('eslint-config-salesforce-typescript');
  add('eslint-config-salesforce-license');
  // eslint and all plugins must be installed on a local basis, regardless of if it uses a shared config.
  // https://eslint.org/docs/user-guide/getting-started
  Object.entries(eslintPjson.devDependencies).forEach(([name, version]) => add(name, version));
  Object.entries(eslintHeaderPjson.devDependencies).forEach(([name, version]) => add(name, version));

  if (added.length > 0) {
    pjson.actions.push(`adding required devDependencies ${added.join(', ')}`);
  }

  if (removed.length >= 0) {
    pjson.actions.push('removed devDependencies controlled by dev-scripts');
  }

  pjson.write();
  return added.length > 0;
};
