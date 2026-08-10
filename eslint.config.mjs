/*
 * Copyright 2026, Salesforce, Inc.
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
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import headerPlugin from '@tony.ganchev/eslint-plugin-header';

export default [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      header: headerPlugin,
    },
    rules: {
      'header/header': [
        2,
        'block',
        [
          '',
          {
            pattern: ' \\* Copyright \\d{4}, Salesforce, Inc\\.',
            template: ' * Copyright 2026, Salesforce, Inc.',
          },
          ' *',
          ' * Licensed under the Apache License, Version 2.0 (the "License");',
          ' * you may not use this file except in compliance with the License.',
          ' * You may obtain a copy of the License at',
          ' *',
          ' *     http://www.apache.org/licenses/LICENSE-2.0',
          ' *',
          ' * Unless required by applicable law or agreed to in writing, software',
          ' * distributed under the License is distributed on an "AS IS" BASIS,',
          ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
          ' * See the License for the specific language governing permissions and',
          ' * limitations under the License.',
          ' ',
        ],
      ],
    },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  eslintConfigPrettier,
];
