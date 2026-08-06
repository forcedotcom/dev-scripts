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
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import unicornPlugin from 'eslint-plugin-unicorn';
import headerPlugin from '@tony.ganchev/eslint-plugin-header';

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', 'lib/**', '*.js', '*.cjs', '*.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      'import-x': importPlugin,
      jsdoc: jsdocPlugin,
      unicorn: unicornPlugin,
      header: headerPlugin,
    },
    rules: {
      // Salesforce base rules
      'valid-typeof': 'off',
      'arrow-body-style': 'error',
      'prefer-arrow-callback': 'error',
      'brace-style': ['error', '1tbs'],
      camelcase: 'error',
      complexity: 'error',
      curly: ['error', 'multi-line'],
      'class-methods-use-this': 'error',
      'eol-last': 'error',
      eqeqeq: ['error', 'smart'],
      'guard-for-in': 'error',
      'id-blacklist': 'error',
      'id-match': 'error',
      'max-len': ['error', { code: 120 }],
      'new-parens': 'error',
      'no-await-in-loop': 'error',
      'no-caller': 'error',
      'no-console': 'error',
      'no-eval': 'error',
      'no-lonely-if': 'error',
      'no-multiple-empty-lines': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/**'],
              message: "imports from this repo's src folder should be a relative path",
            },
            {
              group: ['**/../lib/**', 'lib/**'],
              message: 'import from /src not from /lib. /lib is a build artifact',
            },
          ],
        },
      ],
      'no-shadow': 'off',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-undef-init': 'error',
      'no-underscore-dangle': 'error',
      'no-unsafe-finally': 'error',
      'no-unused-expressions': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'prefer-const': 'error',
      'prefer-spread': 'error',
      'quote-props': ['error', 'as-needed'],
      radix: 'error',
      'spaced-comment': ['error', 'always', { markers: ['/'] }],
      'use-isnan': 'error',
      'no-return-await': 'off',

      // Import plugin
      'import-x/order': 'error',

      // JSDoc plugin
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',
      'jsdoc/tag-lines': [2, 'any', { startLines: 1, endLines: 1 }],

      // Unicorn plugin
      'unicorn/prefer-node-protocol': 'error',

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNullish: true, allowBoolean: true, allowNumber: true },
      ],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/unified-signatures': 'error',

      // License header
      'header/header': [
        2,
        'block',
        [
          '',
          {
            pattern: ' \\* Copyright \\(c\\) \\d{4}, salesforce\\.com, inc\\.',
            template: ' * Copyright (c) 2023, salesforce.com, inc.',
          },
          ' * All rights reserved.',
          ' * Licensed under the BSD 3-Clause license.',
          ' * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause',
          ' ',
        ],
      ],
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
  eslintConfigPrettier
);
