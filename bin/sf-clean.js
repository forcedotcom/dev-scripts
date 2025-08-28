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

const { readFileSync } = require('fs');
const { join } = require('path');
const shell = require('../utils/shelljs');
const log = require('../utils/log');
const loadRootPath = require('../utils/load-root-path');

const argv = process.argv.slice(2);
const cleanAll = argv.includes('all');
const ignoreSigningArtifacts = argv.includes('--ignore-signing-artifacts');

let toClean = ['lib'];
let toCleanAll = ['node_modules'];

const gitignorePath = loadRootPath('.gitignore');

if (gitignorePath) {
  const VALID_SEGMENTS = ['CLEAN', 'CLEAN ALL'];
  const gitignore = readFileSync(join(gitignorePath, '.gitignore'), 'utf8');

  // respect the file EOL (`CRLF` or `LF`).
  //
  // we can't use node's `os.EOL` because that assumes:
  //   * unix only uses `CL`
  //   * win only uses `CRLF`
  //
  // when all 4 scenarios are completely valid
  const originalEOL = gitignore.includes('\r\n') ? '\r\n' : '\n';

  const segments = gitignore
    // Segments are defined by "# --" in the gitignore
    .split('# --')
    // Turn each segment into list of valid gitignore lines
    .map((segment) => segment.split(originalEOL).filter((line) => line && !line.startsWith('#')))
    // Maps segment name to list of valid gitignore lines
    .reduce((map, segment) => {
      const segmentName = (segment.shift() || '').trim();
      if (VALID_SEGMENTS.includes(segmentName)) {
        map[segmentName] = segment;
      }
      return map;
    }, {});

  // The first line of the segment is what we are looking for. Either # -- CLEAN or # -- CLEAN ALL
  if (segments['CLEAN']) {
    toClean = segments['CLEAN'];
  } else {
    const example = join(__dirname, '..', 'files', '.gitignore');
    log(
      'No clean entries found.' +
        'Use "# -- CLEAN" and # -- CLEAN-ALL to specify clean  directories.' +
        `See ${example} for an example.`
    );
  }
  if (segments['CLEAN ALL']) {
    toCleanAll = segments['CLEAN ALL'];
  }
}

// Add defaults for clean all
if (cleanAll) {
  toClean = [...toClean, ...toCleanAll];
}

if (ignoreSigningArtifacts) {
  toClean = toClean.filter((item) => !item.endsWith('.tgz') && !item.endsWith('.sig'));
}

log(`rm -rf ${toClean}`);
shell.rm('-rf', toClean);
