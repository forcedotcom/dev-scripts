/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { dirname } = require('path');
const { cosmiconfigSync } = require('cosmiconfig');
const { isMultiPackageProject } = require('./project-type');

const PACKAGE_DEFAULTS = {
  scripts: {
    build: 'sf-build',
    clean: 'sf-clean',
    'clean-all': 'sf-clean all',
    compile: 'sf-compile',
    docs: 'sf-docs',
    format: 'sf-format',
    // Cleaner errors than ts-node through tests
    pretest: 'sf-compile-test',
    test: 'sf-test',
    lint: 'sf-lint',
    prepack: 'sf-prepack',
  },
};

const LERNA_DEFAULTS = {
  scripts: {
    build: 'lerna build',
    clean: 'lerna clean',
    'clean-all': 'lerna sf-clean all',
    compile: 'lerna compile',
    docs: 'lerna docs',
    format: 'lerna format',
    test: 'lerna test',
    lint: 'lerna lint',
  },
};

const LERNA_PACKAGE_DEFAULTS = {
  scripts: {
    build: 'sf-build',
    clean: 'sf-clean',
    'clean-all': 'sf-clean all',
    compile: 'sf-compile',
    docs: 'sf-docs',
    format: 'sf-format',
    // Cleaner errors than ts-node through tests
    pretest: 'sf-compile-test',
    test: 'sf-test',
    lint: 'sf-lint',
    prepack: 'sf-build',
  },
};

// Path to resolved config object.
const resolvedConfigs = {};

const resolveConfig = (path, inLernaProject) => {
  if (path && resolvedConfigs[path]) {
    return resolvedConfigs[path];
  }

  const explorerSync = cosmiconfigSync('sfdev');
  const result = explorerSync.search(path);

  if (!path && result) {
    path = dirname(result.filepath);
  }

  let defaults = PACKAGE_DEFAULTS;

  if (path && isMultiPackageProject(path)) {
    defaults = LERNA_DEFAULTS;
  } else if (inLernaProject) {
    defaults = LERNA_PACKAGE_DEFAULTS;
  }

  const configFromFile = (result && result.config) || {};

  // Allow users to override certain scripts
  const config = Object.assign({}, defaults, configFromFile, {
    scripts: Object.assign({}, defaults.scripts || {}, configFromFile.script || {}),
  });

  let excludeScripts = config['exclude-scripts'] || [];

  // Only keep specified scripts
  if (config['only-scripts'] && config['only-scripts'].length > 0) {
    excludeScripts = [
      ...excludeScripts,
      ...Object.keys(config.scripts).filter((scriptName) => !config['only-scripts'].includes(scriptName)),
    ];
  }

  // Remove excluded items
  excludeScripts.forEach((scriptName) => {
    delete config.scripts[scriptName];
  });

  resolvedConfigs[path] = config;
  return config;
};

module.exports = { resolveConfig };
