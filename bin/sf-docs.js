#!/usr/bin/env node
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const shell = require('../utils/shelljs');
const packageRoot = require('../utils/package-path');

// eslint-disable-next-line import/order
let options = require('@salesforce/dev-config/typedoc');

try {
  const definedOptions = require(`${packageRoot}/typedoc`);
  options = Object.assign(options, definedOptions);
} catch (err) {
  /* do nothing */
}

let outDir = 'docs';

// preserve perf test files, which are also stored in gh-pages
shell.exec(`find ./${outDir}/* -not -path './${outDir}/perf*' -delete`);

outDir = join(packageRoot, outDir, 'tmp');

let command = `yarn typedoc --out ${outDir}`;

// typedocs does not allow extending configs, so merge the
// defaults and overrides and put them on the command
for (const key of Object.keys(options)) {
  const val = options[key];
  if (typeof val === 'boolean') {
    if (val) {
      command += ` --${key}`;
    }
  } else {
    command += ` --${key} ${val}`;
  }
}

shell.exec(command, {
  cwd: packageRoot,
});

shell.mv(`${outDir}/*`, `${outDir}/..`);
shell.rm('-rf', `${outDir}`);
