#!/usr/bin/env node
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
