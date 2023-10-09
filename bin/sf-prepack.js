#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const chalk = require('chalk');
const shell = require('../utils/shelljs');
const { isPlugin } = require('../utils/project-type');
const packageRoot = require('../utils/package-path');
const { semverIsLessThan } = require('../utils/semver');

shell.exec('yarn build');

if (isPlugin(packageRoot)) {
  if (shell.which('oclif')) {
    shell.exec('oclif manifest .');
    const version = shell.exec('oclif --version', { silent: true }).stdout.trim().replace('oclif/', '').split(' ')[0];
    if (semverIsLessThan(version, '3.14.0')) {
      // eslint-disable-next-line no-console
      console.log(
        chalk.yellow('Warning:'),
        // eslint-disable-next-line max-len
        `oclif version ${version} is less than 3.14.0. Please upgrade to 3.14.0 or higher to use generate oclif.lock file.`
      );
    } else {
      shell.exec('oclif lock');
    }
  } else if (shell.which('oclif-dev')) {
    // eslint-disable-next-line no-console
    console.log(chalk.yellow('Warning:'), 'oclif-dev is deprecated. Please use oclif instead.');
    shell.exec('oclif-dev manifest');
  } else {
    // eslint-disable-next-line no-console
    console.log(chalk.red('Failed:'), 'Cannot generate oclif.manifest.json because oclif is not installed.');
    process.exitCode = 1;
  }
}
