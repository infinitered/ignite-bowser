<p align="center"><img src="http://ir_public.s3.amazonaws.com/projects/ignite/ignite-bowser-launch-screen.png" alt="logo" width="414px"></p>

# Ignite IR Boilerplate ("Bowser")

_NOTE: This repo has been renamed from ignite-ir-boilerplate-bowser to ignite-bowser. Although web traffic and git operations for the previous name will be redirected, we recommend you update any links and git urls for this repo._

<a href="https://circleci.com/gh/infinitered/ignite-bowser"><img alt="CircleCI" src="https://circleci.com/gh/infinitered/ignite-bowser.svg?style=svg" /></a>

## Infinite Red's latest and greatest React Native boilerplate

Once you've installed the [Ignite CLI](https://github.com/infinitered/ignite), you can get started with this boilerplate.

This is the boilerplate that the [Infinite Red](https://infinite.red) team recommends and uses on a day-to-day basis. Prior art includes [Ignite Andross](https://github.com/infinitered/ignite-andross).

Includes:

* React Native
* React Navigation
* MobX State Tree
* TypeScript
* Reactotron (requires 2.x)
* And more!

To see it in action, check out these [examples](https://github.com/infinitered/ignite-bowser-examples)!

## Quick Start

First, install Ignite CLI:

```
$ yarn global add ignite-cli
```

Then spin up a new Bowser-powered React Native app:

```
$ ignite new MyApp -b bowser
```

The Ignite Bowser boilerplate project's structure will look similar to this:

```
ignite-project
├── app
│   ├── components
│   ├── i18n
│   ├── models
│   ├── navigation
│   ├── screens
│   ├── services
│   ├── theme
│   ├── utils
│   ├── app.tsx
│   ├── environment-variables.ts
├── storybook
│   ├── views
│   ├── index.ts
│   ├── storybook-registry.ts
│   ├── storybook.ts
├── test
│   ├── __snapshots__
│   ├── storyshots.test.ts.snap
│   ├── mock-i18n.ts
│   ├── mock-reactotron.ts
│   ├── setup.ts
│   ├── storyshots.test.ts
├── README.md
├── android
├── ignite
│   ├── ignite.json
│   └── plugins
├── index.js
├── ios
└── package.json
```

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the `app` directory looks similar to the following:

```
app
│── components
│── i18n
├── models
├── navigation
├── screens
├── services
├── theme
├── utils
├── app.tsx
├── environment-variables.ts
```
**components**
This is where your React dumb components will live. Each component will have a directory containing the `.tsx` file, along with a story file, and optionally `.presets`, and `.props` files for larger components. The app will come with some commonly used components like Button.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc. There's also an extensions directory with useful shared extensions that you can include in your models like `.extend(withRootStore)` or `.extend(withEnvironment)` to access the root store or environment respectively.

**navigation**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truely shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application. This is also where you will specify whether you want to run the app in storybook mode.

### ./ignite directory
The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find generators, plugins and examples to help you get started with React Native.

### ./storybook directory
This is where your stories will be registered and where the Storybook configs will live

### ./test directory
This directory will hold your Jest configs and mocks, as well as your [storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) test file. This is a file that contains the snapshots of all your component storybooks.

## Previous Boilerplates

* [2017 aka Andross](https://github.com/infinitered/ignite-andross)
* [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)

## Premium Support

[Ignite CLI](https://infinite.red/ignite), Ignite Andross](https://github.com/infinitered/ignite-andross), and [Ignite Bowser](https://github.com/infinitered/ignite-bowser), as open source projects, are free to use and always will be. [Infinite Red](https://infinite.red/) offers premium Ignite CLI support and general mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us for more details.
