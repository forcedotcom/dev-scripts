/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
