<p align="center"><img src="http://ir_public.s3.amazonaws.com/projects/ignite/ignite-bowser-launch-screen.png" alt="logo" width="414px"></p>

# Ignite IR Boilerplate ("Bowser")

<a href='https://semaphoreci.com/ir/ignite-ir-boilerplate-bowser'> <img src='https://semaphoreci.com/api/v1/ir/ignite-ir-boilerplate-bowser/branches/master/badge.svg' alt='Build Status'></a>

## The latest and greatest boilerplate for Infinite Red opinions (Beta)

When you've installed the [Ignite CLI](https://github.com/infinitered/ignite), you can get started with this boilerplate.

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our React Native stack.

Currently includes:

* React Native
* React Navigation
* MobX State Tree
* TypeScript
* Reactotron (requires 2.x)
* And more!

To see it in action, check out these [examples](https://github.com/infinitered/ignite-bowser-examples)!

## Quick Start

The Ignite Bowser boilerplate project's structure will look similar to this:

```
ignite-project
├── src
│   ├── app
│   ├── i18n
│   ├── lib
│   ├── models
│   ├── navigation
│   ├── services
│   ├── theme
│   ├── views
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
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── keystores
│   └── settings.gradle
├── ignite
│   ├── ignite.json
│   └── plugins
├── index.js
├── ios
│   ├── IgniteProject
│   ├── IgniteProject-tvOS
│   ├── IgniteProject-tvOSTests
│   ├── IgniteProject.xcodeproj
│   └── IgniteProjectTests
└── package.json
```

The directory structure uses a ["feature first, function second"](https://alligator.io/react/index-js-public-interfaces/) approach to organization. Files are grouped by the feature they are supporting rather than the type of file.

For example: A custom `Button` component would have the main component file, and test, and any assets or helper files all grouped together in one folder.

This is a departure from the previous boilerplate, which grouped files by type (components together, styles together, tests together, images together, etc.). One feature of this new approach is the use of index files which export specific functions from files in the directory to create a public interface for each "thing", or "feature. You'll see that pattern quite a bit in this boilerplate.


## ./src directory

Included in an Ignite boilerplate project is the src directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the src directory looks similar to the following:

```
src
├── app
│── i18n
├── lib
├── models
├── navigation
├── services
├── theme
├── views
```

**app**
This is where a lot of your app's initialization takes place. Here you'll find:
* root-component.tsx - This is the root component of your app that will render your navigators and other views.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**lib**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truely shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigation**
This is where your `react-navigation` navigators will live.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**views**
This is where all of your components will live. Both dumb components and screen components will be located here. Each component will have a directory containing the `.tsx` file, along with a story file, and optionally `.presets`, and `.props` files for larger components.

You may choose to futher break down this directory by organizing your components into "domains", which represent cohesive areas of your application. For example, a "user" domain could hold all components and screens related to managing a user.

**storybook**
This is where your stories will be registered and where the Storybook configs will live

**test**
This directory will hold your Jest configs and mocks, as well as your [storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) test file. This is a file that contains the snapshots of all your component storybooks.

**ignite**
The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find generators, plugins and examples to help you get started with React Native.

## Previous Boilerplates

* [2017 aka Andross](https://github.com/infinitered/ignite-ir-boilerplate-andross)
* [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)

## Premium Support

[Ignite CLI](https://infinite.red/ignite) and [Ignite IR Boilerplate](https://github.com/infinitered/ignite-ir-boilerplate-bowser), as open source projects, are free to use and always will be. [Infinite Red](https://infinite.red/) offers premium Ignite CLI support and general mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us for more details.
