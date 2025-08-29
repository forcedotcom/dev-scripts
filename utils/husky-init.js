/*
 * Copyright 2025, Salesforce, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
