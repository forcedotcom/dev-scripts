/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { readFileSync } = require('fs');

exports.isPlugin = function (packageRoot) {
  let isPlugin = false;
  try {
    const contents = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf-8'));
    isPlugin = contents && !!contents.oclif;
  } catch (err) {
    /* do nothing */
  }
  return isPlugin;
};
