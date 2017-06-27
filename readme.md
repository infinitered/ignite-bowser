# Ignite IR Boilerplate

[![Build Status](https://semaphoreci.com/api/v1/ir/ignite-ir-boilerplate/branches/master/badge.svg)](https://semaphoreci.com/ir/ignite-ir-boilerplate)



## The latest and greatest boilerplate for Infinite Red opinions

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our React Native stack.

Currently includes:

* React Native 0.45.1 (but you can change this if you want to experiment)
* React Navigation
* Redux
* Redux Sagas
* And more!

## Quick Start

When you've installed the [Ignite CLI](https://github.com/infinitered/ignite), you can get started with this boilerplate like this:

```
ignite new MyLatestCreation
```

You can also change the React Native version, just keep in mind, we may not have tested this just yet.

```sh
ignite new MyLatestCreation --react-native-version 0.46.0-rc.2
```

By default we'll ask you some questions during install as to which features you'd like.  If you just want them all, you can skip the questions:

```sh
ignite new MyLatestCreation --max
```

If you want very few of these extras:

```sh
ignite new MyLatestCreation --min
```

## Boilerplate walkthrough

Your `App` folder is where most of the goodies are found in an Ignite Next app. Let's walk through them in more detail. Start with `Containers/App.js` (described below) and work your way down the walkthrough in order.

### Containers

Containers are (mostly) full screens, although they can be sections of screens or application containers.

* `App.js` - your main application. We create a Redux store and configure it here
* `RootContainer.js` - main view of your application. Contains your status bar and navigation component
* `LaunchScreen.js` - this is the first screen shown in your application. It's loaded into the Navigation component
* `LoginScreen.js` - an example login screen. Read the comments in there to learn more!
* `Styles` - styling for each of the above containers and screens

### Navigation

Your primary and other navigation components reside here.

* `AppNavigation.js` - loads in your initial screen and creates your menu(s) in a StackNavigation
* `Styles` - styling for the navigation

### Components

React components go here...pretty self-explanatory. We won't go through each in detail -- open each file to read the comments and view the code.

### Themes

Styling themes used throughout your app styles.

* `ApplicationStyles.js` - app-wide styles
* `Colors.js` - defined colors for your app
* `Fonts.js` - defined fonts for your app
* `Images.js` - loads and caches images used in your app
* `Metrics.js` - useful measurements of things like searchBarHeight

### Config

Initialize and configure things here.

* `AppConfig.js` - simple React Native configuration here
* `DebugConfig.js` - define how you want your debug environment to act
* `ReactotronConfig.js` - configures [Reactotron](https://github.com/infinitered/reactotron) in your project (Note: this [will be extracted](https://github.com/infinitered/ignite/issues/779) into a plugin in the future)
* `ReduxPersist.js` - configures Redux Persist (Note: this [will be extracted](https://github.com/infinitered/ignite/issues/780) into a plugin in the future)

### Fixtures

Contains json files that mimic API responses for quicker development. These are used by the `Services/FixtureApi.js` object to mock API responses.

### Redux, Sagas

Contains a preconfigured Redux and Redux-Sagas setup. Review each file carefully to see how Redux interacts with your application.

_TODO: explain more about Redux & Redux Sagas here_

### Services

Contains your API service and other important utilities for your application.

* `Api.js` - main API service, giving you an interface to communicate with your back end
* `ExamplesRegistry.js` - lets you view component and Ignite plugin examples in your app
* `FixtureApi.js` - mocks your API service, making it faster to develop early on in your app
* `ImmutablePersistenceTransform.js` - part of the redux-persist implementation (will be removed)
* `RehydrationServices.js` - part of the redux-persist implementation (will be removed)

### Lib

We recommend using this folder for modules that can be extracted into their own NPM packages at some point.

### Images

Contains actual images (usually png) used in your application.

### Transforms

Helpers for transforming data between API and your application and vice versa. An example is provided that you can look at to see how it works.

### Tests

This folder (located as a sibling to `App`) contains sample Jest snapshot and unit tests for your application.

**Previous Boilerplates**

* [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)

## Premium Support

[Ignite CLI](https://infinite.red/ignite) and [Ignite IR Boilerplate](https://github.com/infinitered/ignite-ir-boilerplate), as open source projects, are free to use and always will be. [Infinite Red](https://infinite.red/) offers premium Ignite CLI support and general mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us for more details.
