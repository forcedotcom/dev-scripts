#!/usr/bin/env node
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const chalk = require('chalk');
const exists = require('../utils/exists');
const exec = require('../utils/shelljs').exec;
const writeDeps = require('../utils/write-dependencies');

exec('npx -y yarn-deduplicate');
const changed = writeDeps();

if (changed) {
  const errorHeader = chalk.red('ERROR: ');
  const errorMsg = "Dependencies have changed and saved to package.json. Rerun 'yarn install' to finish the install";
  // eslint-disable-next-line no-console
  console.error(chalk.bold(`\n${errorHeader}${errorMsg}\n`));
  process.exit(1);
} else {
  require('../utils/standardize-pjson')();
  require('../utils/standardize-files')();
  if (exists('.git')) {
    require('../utils/husky-init')();
  }
}
