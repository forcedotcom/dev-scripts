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
