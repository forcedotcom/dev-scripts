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

const shell = require('shelljs');
const chalk = require('chalk');

shell.set('-e');
shell.set('+v');

const origExec = shell.exec;

process.env.FORCE_COLOR = '1';

shell.exec = function (command, ...args) {
  const options = Object.assign(
    {
      /* Set any defaults here */
    },
    args[0]
  );
  if (options.passthrough) {
    command = `${command} ${process.argv.slice(2).join(' ')}`;
  }
  // eslint-disable-next-line no-console
  console.error(chalk.blue(command));
  try {
    return origExec.call(shell, command, ...args);
  } catch (err) {
    // Setting -e will throw an error. We are already displaying the command
    // output above which has information on the problem, so don't show the
    // node specific error thrown by shelljs. This is much cleaner output.
    process.exit(1);
  }
};

module.exports = shell;
