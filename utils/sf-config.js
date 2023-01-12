/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { dirname } = require('path');
const { cosmiconfigSync } = require('cosmiconfig');
const { isPlugin } = require('./project-type');

const PACKAGE_DEFAULTS = {
  scripts: {
    build: 'wireit',
    clean: 'sf-clean',
    'clean-all': 'sf-clean all',
    compile: 'wireit',
    docs: 'sf-docs',
    format: 'wireit',
    // this will be removed
    pretest: undefined,
    posttest: undefined,
    test: 'wireit',
    'test-compile': 'wireit',
    'test-only': 'wireit',
    'test:one': 'wireit',
    lint: 'wireit',
    prepack: 'sf-prepack',
  },
  wireit: {
    build: {
      dependencies: ['compile', 'lint'],
    },
    compile: {
      command: 'tsc --build --pretty ',
      files: ['src/**/*.ts', 'tsconfig.json'],
      output: ['lib/**', '.tsbuildinfo'],
      clean: 'if-file-deleted',
    },
    format: {
      command: 'prettier --write "+(src|test|schemas)/**/*.+(ts|js|json)|command-snapshot.json"',
    },
    lint: {
      command: 'eslint --color --cache --cache-location .eslintcache',
      files: ['src/**/*.ts', 'test/**/*.ts', '.eslintignore', '.eslintrc.js'],
      output: [],
    },
    'test-compile': {
      command: 'tsc -p ./test --pretty',
      files: ['test/**/*.ts', 'tsconfig.json', 'test/tsconfig.json'],
      output: [],
    },
    'test:one': {
      command: 'mocha',
    },
    test: {
      dependencies: ['test-only'],
    },
    'test-only': {
      command: 'nyc mocha test/**/*.test.ts',
      dependencies: ['test-compile'],
      files: ['test/**/*.ts', 'src/**/*.ts', 'tsconfig.json', 'test/tsconfig.json'],
      output: [],
    },
  },
};

const PLUGIN_DEFAULTS = {
  scripts: {
    ...PACKAGE_DEFAULTS.scripts,
    'test:command-reference': 'wireit',
    'test:deprecation-policy': 'wireit',
    'test:json-schema': 'wireit',
  },
  wireit: {
    ...PACKAGE_DEFAULTS.wireit,
    'test:command-reference': {
      command: './bin/dev commandreference:generate --erroronwarnings',
      files: ['src/**/*.ts', 'messages'],
      output: ['tmp/root'],
    },
    'test:deprecation-policy': {
      command: './bin/dev snapshot:compare',
      files: ['src/**/*.ts'],
      output: [],
      dependencies: ['compile'],
    },
    'test:json-schema': {
      command: './bin/dev schema:compare',
      files: ['src/**/*.ts'],
      output: ['schemas'],
    },
    test: {
      dependencies: ['test-only', 'test:command-reference', 'test:deprecation-policy', 'lint', 'test:json-schema'],
    },
  },
};

// Path to resolved config object.
const resolvedConfigs = {};

const resolveConfig = (path) => {
  if (path && resolvedConfigs[path]) {
    return resolvedConfigs[path];
  }

  const explorerSync = cosmiconfigSync('sfdev');
  const result = explorerSync.search(path);

  if (!path && result) {
    path = dirname(result.filepath);
  }

  const defaults = path && isPlugin(path) ? PLUGIN_DEFAULTS : PACKAGE_DEFAULTS;

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
