/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const { resolveConfig } = require('./sf-config');
const { semverIsLessThan } = require('./semver');

const PackageJson = require('./package-json');
const { determineProjectType } = require('./project-type');

const PLUGIN_FILES = ['/messages', '/oclif.manifest.json'];
const CORE_PLUGIN_FILES_BLOCK_LIST = ['/oclif.lock', '/npm-shrinkwrap.json'];
const JIT_PLUGIN_FILES = ['/messages', '/oclif.manifest.json', '/oclif.lock', '/npm-shrinkwrap.json'];

module.exports = (packageRoot = require('./package-path')) => {
  const config = resolveConfig(packageRoot);
  const pjson = new PackageJson(packageRoot);

  const license = pjson.get('license');
  if (license !== (config.license || 'BSD-3-Clause')) {
    pjson.contents.license = 'BSD-3-Clause';
    pjson.actions.push(`updating license`);
  }

  const type = determineProjectType(packageRoot);

  if (type === 'jit-plugin') {
    // ensure that jit plugins have the correct files
    pjson.contents.files = [...new Set([...pjson.contents.files, ...JIT_PLUGIN_FILES])].sort();
  }

  if (type === 'core-plugin') {
    // ensure that core plugins have the correct files and do not have any in the block list
    pjson.contents.files = [
      ...new Set([...pjson.contents.files.filter((f) => !CORE_PLUGIN_FILES_BLOCK_LIST.includes(f)), ...PLUGIN_FILES]),
    ].sort();
  }

  // GENERATE SCRIPTS
  const scriptList = Object.entries(config.scripts);
  const wireitList = Object.entries(config.wireit);

  if (scriptList.length > 0) {
    const scriptsChanged = [];

    const scripts = pjson.get('scripts');
    // eslint-disable-next-line prefer-const
    for (let [scriptName, scriptCommand] of scriptList) {
      if (scripts[scriptName] !== scriptCommand) {
        scripts[scriptName] = scriptCommand;
        scriptsChanged.push(scriptName);
      }
    }
    pjson.actions.push(`standardizing scripts: ${scriptsChanged.join(', ')}`);
    if (wireitList.length > 0) {
      const wireit = pjson.get('wireit');
      for (const [scriptName, scriptCommand] of wireitList) {
        if (wireit[scriptName] !== scriptCommand) {
          wireit[scriptName] = scriptCommand;
          scriptsChanged.push(scriptName);
        }
      }
    }
  }

  try {
    const tsconfig = readFileSync(join(packageRoot, 'tsconfig.json')).toString();
    const engineVersion = '>=16.0.0';
    // Don't control for non dev-config projects, or projects that don't specify an engine already.
    if (
      tsconfig.match(/"extends"\s*:\s*".*@salesforce\/dev-config/) &&
      pjson.contents.engines &&
      pjson.contents.engines.node &&
      pjson.contents.engines.node !== engineVersion &&
      semverIsLessThan(pjson.contents.engines.node.replace('>=', ''), engineVersion.replace('>=', ''))
    ) {
      pjson.actions.push('updating node engine');
      pjson.contents.engines.node = engineVersion;
    }
  } catch (err) {
    // Don't control for non typescript projects.
  }

  pjson.write();
};
