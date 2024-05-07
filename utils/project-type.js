/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { join } = require('path');
const { readFileSync } = require('fs');

const IS_PLUGIN_CACHE = new Map();

exports.isPlugin = function (packageRoot) {
  if (IS_PLUGIN_CACHE.has(packageRoot)) {
    return IS_PLUGIN_CACHE.get(packageRoot);
  }

  let isPlugin = false;
  try {
    const contents = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf-8'));
    isPlugin = contents && !!contents.oclif;
  } catch (err) {
    /* do nothing */
  }

  IS_PLUGIN_CACHE.set(packageRoot, isPlugin);
  return isPlugin;
};

const IS_JIT_PLUGIN_CACHE = new Map();

exports.isJitPlugin = function (packageRoot) {
  if (IS_JIT_PLUGIN_CACHE.has(packageRoot)) {
    return IS_JIT_PLUGIN_CACHE.get(packageRoot);
  }

  let isJitPlugin = false;
  try {
    const jitPluginsList = readFileSync(join(__dirname, '..', 'jit-plugins.json'), 'utf-8');
    const jitPlugins = JSON.parse(jitPluginsList);

    const contents = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf-8'));
    isJitPlugin = contents && !!contents.oclif && jitPlugins.includes(contents.name);
  } catch {
    /* do nothing */
  }

  IS_JIT_PLUGIN_CACHE.set(packageRoot, isJitPlugin);
  return isJitPlugin;
};
