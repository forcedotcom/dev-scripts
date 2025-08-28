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
const { readFileSync } = require('fs');

exports.isPlugin = function (packageRoot) {
  return exports.determineProjectType(packageRoot) !== 'other';
};

const CACHE = new Map();
/**
 * Determine project type.
 *
 * @param {string} packageRoot The root of the package.
 * @returns {PackageType} The type of the package.
 *
 * PackageType = 'plugin' | 'core-plugin' | 'jit-plugin' | 'other'
 */
exports.determineProjectType = function (packageRoot) {
  if (CACHE.has(packageRoot)) {
    return CACHE.get(packageRoot);
  }

  let isPlugin = false;
  let pjson;
  try {
    pjson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf-8'));
    isPlugin = pjson && !!pjson.oclif;
  } catch (err) {
    /* do nothing */
  }

  if (!isPlugin) {
    CACHE.set(packageRoot, 'other');
    return 'other';
  }

  const corePluginsList = readFileSync(join(__dirname, '..', 'core-plugins.json'), 'utf-8');
  const corePlugins = JSON.parse(corePluginsList);
  const isCorePlugin = pjson && !!pjson.oclif && corePlugins.includes(pjson.name);
  if (isCorePlugin) {
    CACHE.set(packageRoot, 'core-plugin');
    return 'core-plugin';
  }

  const jitPluginsList = readFileSync(join(__dirname, '..', 'jit-plugins.json'), 'utf-8');
  const jitPlugins = JSON.parse(jitPluginsList);
  const isJitPlugin = pjson && !!pjson.oclif && jitPlugins.includes(pjson.name);
  if (isJitPlugin) {
    CACHE.set(packageRoot, 'jit-plugin');
    return 'jit-plugin';
  }

  CACHE.set(packageRoot, 'plugin');
  return 'plugin';
};
