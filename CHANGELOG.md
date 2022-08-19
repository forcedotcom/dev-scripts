# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.1.0](https://github.com/forcedotcom/dev-scripts/compare/v2.0.0...v3.1.0) (2022-08-19)

### Features

- change to prettier config ([ac728bc](https://github.com/forcedotcom/dev-scripts/commit/ac728bc3c5aa76b2daee1b59f3474554f0713fbe))
- remove unused linters ([#92](https://github.com/forcedotcom/dev-scripts/issues/92)) ([a282faa](https://github.com/forcedotcom/dev-scripts/commit/a282faaaccdc7b05884e1dbc48d6641225833a2a))
- removes the eslint plugin if found ([f2974ba](https://github.com/forcedotcom/dev-scripts/commit/f2974baa377442f032a5f887266b3bcd41c6e18a))

### Bug Fixes

- allows files to be correctly compared across operating systems ([9c6c478](https://github.com/forcedotcom/dev-scripts/commit/9c6c47844b66415b50abea3d8347c095bf0d9105))
- bump depedencies ([71ad4d4](https://github.com/forcedotcom/dev-scripts/commit/71ad4d4e78c03b78bbb41f13b57644870ec0ca6b))
- force new release ([53fa458](https://github.com/forcedotcom/dev-scripts/commit/53fa45852a68fd87899838ae9bc4d6ef91244948))
- force release ([0f97273](https://github.com/forcedotcom/dev-scripts/commit/0f972736c19a64a52f3e94d262d0ffe34423ac88))
- format plugin schemas and snapshots ([62eecac](https://github.com/forcedotcom/dev-scripts/commit/62eecac8f49bf42ea9d558b680021949c047983e))
- use a single execution of prettier ([9512ebe](https://github.com/forcedotcom/dev-scripts/commit/9512ebea2a2ebc2781fc04cabcd21d5ff1be9105))

## [2.0.0](https://github.com/forcedotcom/dev-scripts/compare/v1.0.4...v2.0.0) (2021-12-17)

### ⚠ BREAKING CHANGES

- typedoc v0.20.0 introduced a lot of breaking changes,
  see https://github.com/TypeStrong/typedoc/releases/tag/v0.20.0

- bump typedoc to 0.22.6 ([c6b0fbe](https://github.com/forcedotcom/dev-scripts/commit/c6b0fbe4fd1b9a7ef6d7b6913ba87ff9aafe53c3))

### [1.0.4](https://github.com/forcedotcom/dev-scripts/compare/v1.0.3...v1.0.4) (2021-12-17)

### Bug Fixes

- add --forbid-only to husky hook, fix nyc file ([#47](https://github.com/forcedotcom/dev-scripts/issues/47)) ([d3826e9](https://github.com/forcedotcom/dev-scripts/commit/d3826e9009c250f4e990b4ca83d378b686f63534))

### [1.0.3](https://github.com/forcedotcom/dev-scripts/compare/v1.0.2...v1.0.3) (2021-12-16)

### Bug Fixes

- remove xunit-file ([19ad227](https://github.com/forcedotcom/dev-scripts/commit/19ad2278cf410f6df4418af3f5ac9998d2c6f0fa))

### [1.0.2](https://github.com/forcedotcom/dev-scripts/compare/v1.0.1...v1.0.2) (2021-12-01)

### Bug Fixes

- only install husky if `.git` folder exists ([d8f5f2b](https://github.com/forcedotcom/dev-scripts/commit/d8f5f2b655bfded51fa48c57bbc7884b708c6e26))
- same for lerna monorepos ([f8cb84d](https://github.com/forcedotcom/dev-scripts/commit/f8cb84d0211fca9f852e2312ab7082947694a1ef))

### [1.0.1](https://github.com/forcedotcom/dev-scripts/compare/v1.0.0...v1.0.1) (2021-11-29)

### Bug Fixes

- insert current year into license ([#35](https://github.com/forcedotcom/dev-scripts/issues/35)) ([1efbbef](https://github.com/forcedotcom/dev-scripts/commit/1efbbefc9da5d6177e5917ab677e75e49842906d))

## 1.0.0 (2021-11-23)

### ⚠ BREAKING CHANGES

- bump husky to v7

### Features

- configurations ([d2b38c3](https://github.com/forcedotcom/dev-scripts/commit/d2b38c32ebadd9a3b02fc1110e50271062d8dc97))

- Merge pull request #34 from forcedotcom/cd/W-10088025 ([7ae3d4d](https://github.com/forcedotcom/dev-scripts/commit/7ae3d4d54a7af52a97ec62dece2997696a6a22df)), closes [#34](https://github.com/forcedotcom/dev-scripts/issues/34)

## [0.9.18](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.17...@salesforce/dev-scripts@0.9.18) (2021-07-09)

**Note:** Version bump only for package @salesforce/dev-scripts

## [0.9.17](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.16...@salesforce/dev-scripts@0.9.17) (2021-07-08)

### Bug Fixes

- oclif manifest ([88bbeff](https://github.com/forcedotcom/sfdx-dev-packages/commit/88bbeff01e6edd9c4c29ed14f8de252fa8f1e10c))

## [0.9.16](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.15...@salesforce/dev-scripts@0.9.16) (2021-07-08)

### Bug Fixes

- use oclif for manifest creation ([b807024](https://github.com/forcedotcom/sfdx-dev-packages/commit/b807024187c58f275b44de9f35d71c7ac07f0961))

## [0.9.15](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.14...@salesforce/dev-scripts@0.9.15) (2021-06-07)

### Bug Fixes

- pin typedoc at v0.18.0 due to breaking changes ([#164](https://github.com/forcedotcom/sfdx-dev-packages/issues/164)) ([dd7f90c](https://github.com/forcedotcom/sfdx-dev-packages/commit/dd7f90cb7b5c9a2508ac0f10ba4b6ec54d262165))

## [0.9.14](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.13...@salesforce/dev-scripts@0.9.14) (2021-06-07)

### Bug Fixes

- fix incorrect version ([#163](https://github.com/forcedotcom/sfdx-dev-packages/issues/163)) ([fcd260c](https://github.com/forcedotcom/sfdx-dev-packages/commit/fcd260cd6707f229c68272270c2b6655e685d738))

## [0.9.13](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.12...@salesforce/dev-scripts@0.9.13) (2021-06-04)

**Note:** Version bump only for package @salesforce/dev-scripts

## [0.9.12](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.11...@salesforce/dev-scripts@0.9.12) (2021-06-03)

**Note:** Version bump only for package @salesforce/dev-scripts

## [0.9.11](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.10...@salesforce/dev-scripts@0.9.11) (2021-05-12)

**Note:** Version bump only for package @salesforce/dev-scripts

## [0.9.10](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.9...@salesforce/dev-scripts@0.9.10) (2021-05-11)

**Note:** Version bump only for package @salesforce/dev-scripts

## [0.9.9](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.7...@salesforce/dev-scripts@0.9.9) (2021-05-11)

**Note:** Version bump only for package @salesforce/dev-scripts

## [0.9.7](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.5...@salesforce/dev-scripts@0.9.7) (2021-04-29)

**Note:** Version bump only for package @salesforce/dev-scripts

## [0.9.5](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.3...@salesforce/dev-scripts@0.9.5) (2021-04-29)

### Bug Fixes

- force publish ([276efe1](https://github.com/forcedotcom/sfdx-dev-packages/commit/276efe1c31041917285d38cb472ef2b767f1af83))

## [0.9.3](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.2...@salesforce/dev-scripts@0.9.3) (2021-04-29)

### Bug Fixes

- add minimum version check to dev-scripts ([#122](https://github.com/forcedotcom/sfdx-dev-packages/issues/122)) ([5d1470a](https://github.com/forcedotcom/sfdx-dev-packages/commit/5d1470a22da2f050ef4ace1ba819b85e2f600f9b))

## [0.9.2](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.1...@salesforce/dev-scripts@0.9.2) (2021-04-19)

**Note:** Version bump only for package @salesforce/dev-scripts

## [0.9.1](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.9.0...@salesforce/dev-scripts@0.9.1) (2021-02-26)

### Bug Fixes

- specify bin for sf-prepack ([ce50cee](https://github.com/forcedotcom/sfdx-dev-packages/commit/ce50cee35716b80e852c4a1498caa99f4d7ba56d))

# [0.9.0](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.8.1...@salesforce/dev-scripts@0.9.0) (2021-02-26)

### Features

- add sf-prepack ([577f0f9](https://github.com/forcedotcom/sfdx-dev-packages/commit/577f0f9700ad2c57d5d7d419c9c384d578bea029))

## [0.8.1](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.8.0...@salesforce/dev-scripts@0.8.1) (2021-02-19)

**Note:** Version bump only for package @salesforce/dev-scripts

# [0.8.0](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.7.1...@salesforce/dev-scripts@0.8.0) (2021-02-19)

### Bug Fixes

- quote only the includes ([38cb96d](https://github.com/forcedotcom/sfdx-dev-packages/commit/38cb96d4dfe55a16f2eb3db3fa702a19caf29b8c))
- remove clean:all in favor of clean-all ([c0f5a20](https://github.com/forcedotcom/sfdx-dev-packages/commit/c0f5a20ca4942feded85e21e0feda672ba0109d2))
- remove nuts from dev scripts ([824b687](https://github.com/forcedotcom/sfdx-dev-packages/commit/824b68711465b37ac3099913b7b315c5241d3bee))

### Features

- adds a script for running NUTs ([4da640d](https://github.com/forcedotcom/sfdx-dev-packages/commit/4da640d52af526168952f50f2fb5774759c5b099))

## [0.7.1](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.7.0...@salesforce/dev-scripts@0.7.1) (2021-02-19)

### Bug Fixes

- testing and linting on windows ([a906fb8](https://github.com/forcedotcom/sfdx-dev-packages/commit/a906fb8da95e194a32ed768f84d6e9c7cbb6e9c6))

# [0.7.0](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.6.3...@salesforce/dev-scripts@0.7.0) (2021-01-28)

### Features

- update typescript version ([#109](https://github.com/forcedotcom/sfdx-dev-packages/issues/109)) ([399a0b0](https://github.com/forcedotcom/sfdx-dev-packages/commit/399a0b03aa831f25511bb3391702c10dc5c4a488))

## [0.6.3](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.6.2...@salesforce/dev-scripts@0.6.3) (2021-01-22)

### Bug Fixes

- packages/dev-scripts/package.json to reduce vulnerabilities ([#94](https://github.com/forcedotcom/sfdx-dev-packages/issues/94)) ([b06a26a](https://github.com/forcedotcom/sfdx-dev-packages/commit/b06a26aa8cc177e2c48e75cab658fe8644f5ba4e))
- packages/dev-scripts/package.json to reduce vulnerabilities ([#95](https://github.com/forcedotcom/sfdx-dev-packages/issues/95)) ([5e8fad4](https://github.com/forcedotcom/sfdx-dev-packages/commit/5e8fad49c73a3cc1373d7d5b156086e26c7fd22d))

## [0.6.2](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.6.1...@salesforce/dev-scripts@0.6.2) (2020-09-14)

### Bug Fixes

- remove mochaOpts in sfdevrc and update .gitignore location ([#100](https://github.com/forcedotcom/sfdx-dev-packages/issues/100)) ([f58733e](https://github.com/forcedotcom/sfdx-dev-packages/commit/f58733ed292ff97818e5da9d78df4bc7a7022fde))

## [0.6.1](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.6.0...@salesforce/dev-scripts@0.6.1) (2020-07-23)

### Bug Fixes

- missing ts-sinon merge and fixed eslint rules ([4d4325b](https://github.com/forcedotcom/sfdx-dev-packages/commit/4d4325b306e579e3ae9f3492b58a66f8eb8a4e56))

# [0.6.0](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.5.0...@salesforce/dev-scripts@0.6.0) (2020-07-21)

### Features

- **@salesforce/dev-scripts:** bump version to 0.5.0 ([0ab4c6f](https://github.com/forcedotcom/sfdx-dev-packages/commit/0ab4c6f64703e588a63e72814f0850aa785778cb))
- add eslint and use it in all packages ([0165cc8](https://github.com/forcedotcom/sfdx-dev-packages/commit/0165cc8853079c7f987dddfb60ced3efb00deea0))
- add getNumber on env ([0c94a64](https://github.com/forcedotcom/sfdx-dev-packages/commit/0c94a64f7ac9af40198918cceda6e96facbc77ca))
- add javascipt eslint rules that typescript extends ([135ac73](https://github.com/forcedotcom/sfdx-dev-packages/commit/135ac73b8c513d8950ac69373349361d9f600a8c))
- add salesforce license linting ([3213135](https://github.com/forcedotcom/sfdx-dev-packages/commit/3213135f34956335ef2c123ec680c2de2bc7f10f))

### BREAKING CHANGES

- **@salesforce/dev-scripts:** Renamed all bin files. Renamed the config file from sfdx-dev-config.json to
  sfdevrc.json. Uses eslint instead of tslint.

# [0.5.0](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.4.2...@salesforce/dev-scripts@0.5.0) (2020-07-02)

### Features

- add conveniences to ts-types ([b1814d6](https://github.com/forcedotcom/sfdx-dev-packages/commit/b1814d6))

## [0.4.2](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.4.1...@salesforce/dev-scripts@0.4.2) (2020-03-03)

### Bug Fixes

- **dev-scripts:** remove invalid fix on lint ([4de39cd](https://github.com/forcedotcom/sfdx-dev-packages/commit/4de39cd))

## [0.4.1](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.4.0...@salesforce/dev-scripts@0.4.1) (2019-08-30)

### Bug Fixes

- npm security upgrades ([053d507](https://github.com/forcedotcom/sfdx-dev-packages/commit/053d507))

# [0.4.0](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.3.14...@salesforce/dev-scripts@0.4.0) (2019-07-17)

### Features

- package updates ([69f3d02](https://github.com/forcedotcom/sfdx-dev-packages/commit/69f3d02))

## [0.3.14](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.3.13...@salesforce/dev-scripts@0.3.14) (2019-05-01)

### Bug Fixes

- clean docs outDir properly in single package projects ([47d4eef](https://github.com/forcedotcom/sfdx-dev-packages/commit/47d4eef))

## [0.3.13](https://github.com/forcedotcom/sfdx-dev-packages/compare/@salesforce/dev-scripts@0.3.12...@salesforce/dev-scripts@0.3.13) (2019-03-12)

### Bug Fixes

- control the node engine based on tsconfig compile target ([1bd6afd](https://github.com/forcedotcom/sfdx-dev-packages/commit/1bd6afd))
- lodah-cli needs to updated to use lodash 4.17.11 ([aabbddf](https://github.com/forcedotcom/sfdx-dev-packages/commit/aabbddf))
