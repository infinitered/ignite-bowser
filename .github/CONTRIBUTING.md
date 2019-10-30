# Contributing to Ignite CLI


We welcome all contributors to Ignite Bowser! This contributing guide will help you get up and running to submit your first pull request.

Before submitting a pull request, you will want to make sure that your branch meets the following requirements:

_These examples assume you're using yarn rather than npm. If you're not using yarn, replace these commands with the [appropriate npm alternative](https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc)_

- Everything works on iOS/Android
- Jest Tests pass in the root folder (`yarn test`)
- New tests are included for any new functionality
- Our linter passes (`yarn lint`)
- Branch has already been [synced with the upstream repo](https://help.github.com/articles/syncing-a-fork/) and any merge-conflicts have been resolved.

## Requirements

- Node 7.6+
- NPM 4 (ships with Node 7)

## Getting Started

1. Fork and then clone the repo (`git clone git@github.com:<YOURGITHUBUSER>/ignite-bowser.git`)
2. Pull all package dependencies (`yarn`)
3. Make your changes

Test it out:

Test your changes by creating a new boilerplate using [ignite-cli](https://github.com/infinitered/ignite) and pointing it to your newly created boilerplate.

```sh
$ ignite new <YOUR_BOILERPLATE_NAME> -b /full/path/to/boilerplate
```

Now you're ready to check out a new branch and get hacking on Ignite Bowser!


## How to Build and Run App

Refer to [this guide](https://github.com/infinitered/ignite/blob/master/.github/CONTRIBUTING.md#how-to-build-and-run-app)

## Testing the App

We use [Jest](https://jestjs.io) for testing.

To run tests from the ignite-bowser folder:

```
$ yarn test
```


## ⛔ Make sure lint passes.

Our CI enforces lint to pass, so we suggest you enable linting to keep your project compliant during development.

**To Run Lint** from ignite-bowser's root directory:

```
$ yarn lint
```

**To Lint on Commit**

1. Install git-hooks => On a Mac `brew install git-hooks` - [Other](https://github.com/icefox/git-hooks/)
2. Setup on Repo => `git hooks --install`

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules can be found in the package.json's `eslintConfig`. [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).