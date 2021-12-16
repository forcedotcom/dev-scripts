# Common scripts and hooks for Salesforce typescript projects

## What is this?

A collection of commonly needed scripts and hooks used by Salesforce typescript projects. This helps to enforce consistency across and reduces the amount of time it takes to setup new projects. This also reduces the amount of needed configuration required for each project by using common configuration from [@salesforce/dev-config](https://www.npmjs.com/package/@salesforce/dev-config) by default.

When dev-scripts is added as a dev dependency, it will enforce the package.json has the right scripts, hooks, and dependencies. Use the `.sfdevrc.json` to configure what is generated and controlled.

To automatically have dev-scripts enabled after install, edit `package.json`:

```json
// package.json
{
  "scripts": {
    "prepare": "sf-install"
  }
}
```

The common scripts that are added to each project include:

- clean: cleans lib/, coverage/, and a host of other files that shouldn't be included in the repository; include `all` to also clean node_modules
  e.g. `yarn clean` or `yarn clean-all`
- compile: compiles src/ to /lib using tsc
  e.g. `yarn compile`
- lint: lints src/ using tslint
  e.g. `yarn lint`
- test: runs tests using nyc and mocha
  e.g. `yarn test`
- build: runs the clean, compile, lint, and test targets
  e.g. `yarn build`
- docs: generates docs/ using typedoc
  e.g. `yarn docs`

The common hooks that are added to each project include:

- commit-msg: verifies the commit message conforms to [angular guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines) using [commitlint](https://github.com/marionebl/commitlint).
- pre-commit: runs prettier on staged files and `yarn docs`.
- pre-push: runs `yarn build`.

## Configuration

To configure what this generates and controls, create a `.sfdevrc` file. Look at the [schema](./sfdevrc.schema.json) to see what options are available.

## Config File Notes

### tsconfig

The `include` section has to live in the repository's tsconfig file until there is a way to specify a base. We plan to remove this section when https://github.com/Microsoft/TypeScript/issues/25430 is fixed
