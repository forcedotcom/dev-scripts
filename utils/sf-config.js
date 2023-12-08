/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { existsSync } = require('fs');
const { dirname, join } = require('path');
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
    'test:compile': undefined,
    'test:only': 'wireit',
    'link-check': 'wireit',
    lint: 'wireit',
    prepack: 'sf-prepack',
  },
  wireit: {
    build: {
      dependencies: ['compile', 'lint'],
    },
    compile: {
      command: 'tsc -p . --pretty --incremental',
      files: ['src/**/*.ts', '**/tsconfig.json', 'messages/**'],
      output: ['lib/**', '*.tsbuildinfo'],
      clean: 'if-file-deleted',
    },
    format: {
      command: 'prettier --write "+(src|test|schemas)/**/*.+(ts|js|json)|command-snapshot.json"',
      files: ['src/**/*.ts', 'test/**/*.ts', 'schemas/**/*.json', 'command-snapshot.json', '.prettier*'],
      output: [],
    },
    lint: {
      command: 'eslint src test --color --cache --cache-location .eslintcache',
      files: ['src/**/*.ts', 'test/**/*.ts', 'messages/**', '**/.eslint*', '**/tsconfig.json'],
      output: [],
    },
    'link-check': {
      command:
        // eslint-disable-next-line max-len
        'node -e "process.exit(process.env.CI ? 0 : 1)" || linkinator "**/*.md" --skip "CHANGELOG.md|node_modules|test/|confluence.internal.salesforce.com|%s" --markdown --retry --directory-listing --verbosity error',
      files: ['./*.md', './!(CHANGELOG).md', 'messages/**/*.md'],
      output: [],
    },
    // compiles all test files, including NUTs
    'test:compile': {
      command: 'tsc -p "./test" --pretty',
      files: ['test/**/*.ts', '**/tsconfig.json'],
      output: [],
    },
    test: {
      dependencies: ['test:only', 'test:compile', 'link-check'],
    },
    'test:only': {
      command: 'nyc mocha "test/**/*.test.ts"',
      // things that use `chalk` might not output colors with how wireit uses spawn and gha treats that as non-tty
      // see https://github.com/chalk/supports-color/issues/106
      env: {
        FORCE_COLOR: '2',
      },
      files: ['test/**/*.ts', 'src/**/*.ts', '**/tsconfig.json', '.mocha*', '!*.nut.ts', '.nycrc'],
      output: [],
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

  // if path is undefined/null, assume we're executing from a plugin root
  const usesJsBinScripts = existsSync(join(path ?? process.cwd(), 'bin', 'dev.js'));
  const loader = 'node --loader ts-node/esm --no-warnings=ExperimentalWarning';
  const dev = usesJsBinScripts ? `${loader} "./bin/dev.js"` : '"./bin/dev"';
  const pluginDefaults = {
    scripts: {
      ...PACKAGE_DEFAULTS.scripts,
      // wireit scripts don't need an entry in pjson scripts.
      // remove these from scripts and let wireit handle them (just repeat running yarn test)
      // https://github.com/google/wireit/blob/main/CHANGELOG.md#094---2023-01-30
      'test:command-reference': undefined,
      'test:deprecation-policy': undefined,
      'test:json-schema': undefined,
    },
    wireit: {
      ...PACKAGE_DEFAULTS.wireit,
      'test:command-reference': {
        command: `${dev} commandreference:generate --erroronwarnings`,
        files: ['src/**/*.ts', 'messages/**', 'package.json'],
        output: ['tmp/root'],
      },
      'test:deprecation-policy': {
        command: `${dev} snapshot:compare`,
        files: ['src/**/*.ts'],
        output: [],
        dependencies: ['compile'],
      },
      'test:json-schema': {
        command: `${dev} schema:compare`,
        files: ['src/**/*.ts', 'schemas'],
        output: [],
      },
      test: {
        dependencies: [
          'test:compile',
          'test:only',
          'test:command-reference',
          'test:deprecation-policy',
          'lint',
          'test:json-schema',
          'link-check',
        ],
      },
    },
  };

  const defaults = path && isPlugin(path) ? pluginDefaults : PACKAGE_DEFAULTS;

  const configFromFile = (result && result.config) || {};

  if (configFromFile.test?.testsPath) {
    defaults.wireit['test:only'].command = `nyc mocha "${configFromFile.test.testsPath}"`;
  }

  // Allow users to override certain scripts
  const config = Object.assign({}, defaults, configFromFile, {
    scripts: Object.assign({}, defaults.scripts ?? {}, configFromFile.scripts ?? {}),
    wireit: Object.assign({}, defaults.wireit ?? {}, configFromFile.wireit ?? {}),
    devDepOverrides: configFromFile.devDepOverrides ?? [],
  });

  let excludeScripts = config['exclude-scripts'] || [];

  // Only keep specified scripts
  if (config['only-scripts'] && config['only-scripts'].length > 0) {
    excludeScripts = [
      ...excludeScripts,
      ...Object.keys(config.scripts).filter((scriptName) => !config['only-scripts'].includes(scriptName)),
      ...Object.keys(config.wireit).filter((scriptName) => !config['only-scripts'].includes(scriptName)),
    ];
  }

  // Remove excluded items
  excludeScripts.forEach((scriptName) => {
    delete config.scripts[scriptName];
    delete config.wireit[scriptName];
  });

  resolvedConfigs[path] = config;
  return config;
};

module.exports = { resolveConfig };
