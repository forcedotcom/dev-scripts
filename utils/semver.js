/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

exports.semverIsLessThan = (version, target) => {
  const [major, minor, patch] = version.split('.').map((v) => parseInt(v, 10));
  const [targetMajor, targetMinor, targetPatch] = target.split('.').map((v) => parseInt(v, 10));
  if (major < targetMajor) {
    return true;
  }
  if (major === targetMajor && minor < targetMinor) {
    return true;
  }
  if (major === targetMajor && minor === targetMinor && patch < targetPatch) {
    return true;
  }
  return false;
};
