/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const packagePath = require('../utils/package-path');
const shell = require('./shelljs');

// This should be in each package's `prepare` script but we already use it to run `sf-install`.
shell.exec('yarn husky install');

function initializeHusky() {
  try {
    const localGitHooks = fs
      .readdirSync(path.normalize(`${packagePath}${path.sep}.husky`))
      .filter((hook) => hook !== '_');

    if (localGitHooks.length === 0) {
      shell.exec("yarn husky add .husky/commit-msg 'yarn commitlint --edit'");
      shell.exec("yarn husky add .husky/pre-commit 'yarn lint && yarn pretty-quick --staged'");
      shell.exec("yarn husky add .husky/pre-push 'yarn build && yarn run test:only -- --forbid-only'");
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      const errorHeader = chalk.red('ERROR: ');
      const errorMsg = ".husky folder wasn't found, try running `yarn husky install` to finish the install";
      // eslint-disable-next-line no-console
      console.error(chalk.bold(`\n${errorHeader}${errorMsg}\n`));
      process.exit(1);
    }
    throw err;
  }
}

module.exports = initializeHusky;
