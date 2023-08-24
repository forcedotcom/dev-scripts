/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { readFileSync, unlinkSync, copyFileSync, writeFileSync } = require('fs');
const log = require('./log');
const exists = require('./exists');
const { resolveConfig } = require('./sf-config');
const PackageJson = require('./package-json');

const FILES_PATH = join(__dirname, '..', 'files');

const FILE_NAME_LICENSE = 'LICENSE.txt';
const FILE_NAME_GITIGNORE = 'gitignore';
const FILE_NAME_MOCHARC = 'mocharc.json';

function isDifferent(sourcePath, targetPath) {
  try {
    // Using .replace() to normalize line endings across operating systems.
    // eslint-disable-next-line no-control-regex
    const sourceFile = readFileSync(sourcePath, 'utf8').replace(new RegExp('\r\n', 'g'), '\n');
    // eslint-disable-next-line no-control-regex
    const targetFile = readFileSync(targetPath, 'utf8').replace(new RegExp('\r\n', 'g'), '\n');

    return sourceFile !== targetFile;
  } catch (error) {
    /* do nothing */
  }
  return true;
}

function copyFile(sourcePath, targetPath, override = false) {
  const fileExists = exists(targetPath);
  const shouldWriteFile = override || !fileExists;

  if (shouldWriteFile && isDifferent(sourcePath, targetPath)) {
    copyFileSync(sourcePath, targetPath);
    return targetPath;
  }
}

function writeLicenseFile(targetDir) {
  const licenseSourcePath = join(FILES_PATH, FILE_NAME_LICENSE);
  const licenseSourceTmpPath = join(FILES_PATH, `${FILE_NAME_LICENSE}.tmp`);
  const licenseTargetPath = join(targetDir, FILE_NAME_LICENSE);

  const license = readFileSync(licenseSourcePath, 'utf-8');
  const licenseWithYear = license.replace('REPLACE_YEAR', new Date().getFullYear());

  // Hacky: create a tmp file to copy from to utilize existing checks and logging in copyFile()
  writeFileSync(licenseSourceTmpPath, licenseWithYear);

  // Always keep license file up-to-date
  return copyFile(licenseSourceTmpPath, licenseTargetPath, true);
}

function writeGitignore(targetDir) {
  const gitignoreSourcePath = join(FILES_PATH, FILE_NAME_GITIGNORE);
  const gitignoreTargetPath = join(targetDir, `.${FILE_NAME_GITIGNORE}`);
  // Try to copy the default.
  const copied = copyFile(gitignoreSourcePath, gitignoreTargetPath);

  if (!copied) {
    let original = readFileSync(gitignoreTargetPath, 'utf-8');
    if (!original.includes('# -- CLEAN')) {
      log(`The .gitignore doesn't contain any clean entries. See ${gitignoreSourcePath} for examples.`);
    } else {
      // Add the default clean-all entries if they don't exist.
      let needsWrite = false;
      for (const entry of ['.wireit', '.eslintcache', '*.tsbuildinfo']) {
        if (!original.includes(entry)) {
          original = original.replace('# -- CLEAN ALL', `# -- CLEAN ALL\n${entry}`);
          needsWrite = true;
        }
      }
      if (needsWrite) {
        writeFileSync(gitignoreTargetPath, original);
      }
    }
  }
  return copied;
}

function writeMocharcJson(targetDir) {
  const mocharcSourcePath = join(FILES_PATH, FILE_NAME_MOCHARC);
  const gitignoreTargetPath = join(targetDir, `.${FILE_NAME_MOCHARC}`);
  // Try to copy the default.
  return copyFile(mocharcSourcePath, gitignoreTargetPath);
}

function replaceInFile(filePath, replaceFn) {
  const contents = readFileSync(filePath, 'utf8');
  const newContents = replaceFn(contents);
  if (newContents !== contents) {
    writeFileSync(filePath, newContents);
  }
}

// eslint-disable-next-line complexity
module.exports = (packageRoot = require('./package-path')) => {
  const config = resolveConfig(packageRoot);
  const testPath = join(packageRoot, 'test');
  const scripts = config.scripts;

  let added = [];
  let removed = [];

  added.push(writeLicenseFile(packageRoot));
  added.push(writeGitignore(packageRoot));
  added.push(writeMocharcJson(packageRoot));

  // We want prettier in the root since that is when the commit format hook runs
  if (scripts.format) {
    const prettierSourcePath = join(FILES_PATH, 'prettierrc.json');
    const prettierTargetPath = join(packageRoot, '.prettierrc.json');
    // prettier config files can't have the header, so it doesn't use a strict mode, meaning, it won't be overridden
    added.push(copyFile(prettierSourcePath, prettierTargetPath, false));
  }

  // nyc file
  if (scripts.test) {
    const nycSourcePath = join(FILES_PATH, 'nycrc');
    const nycTargetPath = join(packageRoot, '.nycrc');
    // Allow repos to override their coverage so don't override file
    added.push(copyFile(nycSourcePath, nycTargetPath, false));
  }

  // eslint files
  if (scripts.lint) {
    const lintConfig = config.lint || {};
    const strict = config.strict || lintConfig.strict;

    const eslintJsTargetPath = join(packageRoot, '.eslintrc.js');
    // if .eslintrc.js exists, copy it to .eslintrc.cjs and remove .eslintrc.js
    if (exists(eslintJsTargetPath)) {
      replaceInFile(eslintJsTargetPath, (contents) => contents.replace(/eslintrc.js/, 'eslintrc.cjs'));
      added.push(copyFile(eslintJsTargetPath, eslintJsTargetPath.replace('.js', '.cjs'), strict));
      unlinkSync(eslintJsTargetPath);
      removed.push(eslintJsTargetPath);
    }

    const eslintSourcePath = join(FILES_PATH, strict ? 'eslintrc-strict.cjs' : 'eslintrc.cjs');
    const eslintTargetPath = join(packageRoot, '.eslintrc.cjs');
    added.push(copyFile(eslintSourcePath, eslintTargetPath, strict));

    if (exists(testPath)) {
      const eslintJsTestTargetPath = join(testPath, '.eslintrc.js');
      // if .eslintrc.js exists, copy it to .eslintrc.cjs and remove .eslintrc.js
      if (exists(eslintJsTestTargetPath)) {
        replaceInFile(eslintJsTestTargetPath, (contents) => contents.replace(/eslintrc.js/, 'eslintrc.cjs'));
        added.push(copyFile(eslintJsTestTargetPath, eslintJsTestTargetPath.replace('.js', '.cjs'), strict));
        unlinkSync(eslintJsTestTargetPath);
        removed.push(eslintJsTestTargetPath);
      }

      const eslintTestSourcePath = join(FILES_PATH, strict ? 'eslintrc-test-strict.cjs' : 'eslintrc-test.cjs');
      const eslintTestTargetPath = join(testPath, '.eslintrc.cjs');
      added.push(copyFile(eslintTestSourcePath, eslintTestTargetPath, strict));
    }

    // We don't use tslint anymore.
    const tslintPath = join(packageRoot, 'tslint.json');
    if (exists(tslintPath)) {
      unlinkSync(tslintPath);
      removed.push(tslintPath);
    }

    const tslintTestPath = join(testPath, 'tslint.json');
    if (exists(tslintTestPath)) {
      unlinkSync(tslintTestPath);
      removed.push(tslintTestPath);
    }
  }

  // tsconfig files
  if (scripts.compile) {
    const compileConfig = config.compile || {};
    const strict = config.strict || compileConfig.strict;

    const tsconfigSourcePath = join(FILES_PATH, strict ? 'tsconfig-strict.json' : 'tsconfig.json');
    const tsconfigTargetPath = join(packageRoot, 'tsconfig.json');
    added.push(copyFile(tsconfigSourcePath, tsconfigTargetPath, strict));

    if (exists(testPath)) {
      const tsconfigTestSourcePath = join(FILES_PATH, strict ? 'tsconfig-test-strict.json' : 'tsconfig-test.json');
      const tsconfigTestTargetPath = join(testPath, 'tsconfig.json');
      added.push(copyFile(tsconfigTestSourcePath, tsconfigTestTargetPath, strict));
    }
  }

  added = added.filter((a) => !!a);
  removed = removed.filter((a) => !!a);

  if (added.length > 0 || removed.length > 0) {
    log(`standardizing config files for ${new PackageJson(packageRoot).name}`);
  }
  if (added.length > 0) {
    log(`adding config files ${added.join(', ')}`, 2);
  }
  if (removed.length > 0) {
    log(`removing config files ${removed.join(', ')}`, 2);
  }
};
