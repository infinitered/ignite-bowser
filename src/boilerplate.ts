import { merge, pipe, assoc, omit, __ } from "ramda"
import { getReactNativeVersion } from "./lib/react-native-version"
import { GluegunToolbox } from "gluegun"

// We need this value here, as well as in our package.json.ejs template
const REACT_NATIVE_GESTURE_HANDLER_VERSION = "^1.5.0"

/**
 * Is Android installed?
 *
 * $ANDROID_HOME/tools folder has to exist.
 */
export const isAndroidInstalled = (toolbox: GluegunToolbox): boolean => {
  const androidHome = process.env.ANDROID_HOME
  const hasAndroidEnv = !toolbox.strings.isBlank(androidHome)
  const hasAndroid = hasAndroidEnv && toolbox.filesystem.exists(`${androidHome}/tools`) === "dir"

  return Boolean(hasAndroid)
}

/**
 * Let's install.
 */
export const install = async (toolbox: GluegunToolbox) => {
  const {
    filesystem,
    parameters,
    ignite,
    reactNative,
    print,
    system,
    template,
    prompt,
    patching,
    strings,
  } = toolbox
  const { colors } = print
  const { red, yellow, bold, gray, cyan } = colors
  const isWindows = process.platform === "win32"
  const isMac = process.platform === "darwin"

  if (parameters.options["dry-run"]) return

  const perfStart = new Date().getTime()

  const name = parameters.first
  const spinner = print
    .spin(`using the ${red("Infinite Red")} boilerplate v3 (code name 'Bowser')`)
    .succeed()

  let includeDetox = false
  if (isMac) {
    const askAboutDetox = parameters.options.detox === undefined
    includeDetox = askAboutDetox
      ? await prompt.confirm("Would you like to include Detox end-to-end tests?")
      : parameters.options.detox === true

    if (includeDetox) {
      // prettier-ignore
      print.info(`
          You'll love Detox for testing your app! There are some additional requirements to
          install, so make sure to check out ${cyan('e2e/README.md')} in your generated app!
        `)
    }
  } else {
    if (parameters.options.detox === true) {
      // prettier-ignore
      if (isWindows) {
        print.info("Skipping Detox because it is only supported on macOS, but you're running Windows")
      } else {
        print.info("Skipping Detox because it is only supported on macOS")
      }
    }
  }

  // attempt to install React Native or die trying
  const rnInstall = await reactNative.install({
    name,
    version: getReactNativeVersion(toolbox),
    useNpm: !ignite.useYarn,
  })

  if (rnInstall.exitCode > 0) process.exit(rnInstall.exitCode)

  // remove the __tests__ directory, App.js, and unnecessary config files that come with React Native
  const filesToRemove = [
    ".babelrc",
    "babel.config.js",
    ".buckconfig",
    ".eslintrc.js",
    ".prettierrc.js",
    ".flowconfig",
    "App.js",
    "__tests__",
  ]
  filesToRemove.map(filesystem.remove)

  // copy our App, Tests & storybook directories
  spinner.text = "▸ copying files"
  spinner.start()
  const boilerplatePath = `${__dirname}/../boilerplate`
  const copyOpts = { overwrite: true, matching: "!*.ejs" }
  filesystem.copy(`${boilerplatePath}/app`, `${process.cwd()}/app`, copyOpts)
  filesystem.copy(`${boilerplatePath}/test`, `${process.cwd()}/test`, copyOpts)
  filesystem.copy(`${boilerplatePath}/storybook`, `${process.cwd()}/storybook`, copyOpts)
  filesystem.copy(`${boilerplatePath}/bin`, `${process.cwd()}/bin`, copyOpts)
  includeDetox && filesystem.copy(`${boilerplatePath}/e2e`, `${process.cwd()}/e2e`, copyOpts)
  spinner.stop()

  // generate some templates
  spinner.text = "▸ generating files"

  const templates = [
    { template: "index.js.ejs", target: "index.js" },
    { template: "README.md", target: "README.md" },
    { template: ".gitignore.ejs", target: ".gitignore" },
    { template: ".env.example", target: ".env" },
    { template: ".prettierignore", target: ".prettierignore" },
    { template: ".solidarity", target: ".solidarity" },
    { template: "babel.config.js", target: "babel.config.js" },
    { template: "react-native.config.js", target: "react-native.config.js" },
    { template: "tsconfig.json", target: "tsconfig.json" },
    { template: "app/app.tsx.ejs", target: "app/app.tsx" },
    {
      template: "app/screens/welcome-screen/welcome-screen.tsx.ejs",
      target: "app/screens/welcome-screen/welcome-screen.tsx",
    },
    {
      template: "app/screens/demo-screen/demo-screen.tsx.ejs",
      target: "app/screens/demo-screen/demo-screen.tsx",
    },
    { template: "bin/postInstall", target: "bin/postInstall" },
  ]
  const templateProps = {
    name,
    igniteVersion: ignite.version,
    reactNativeVersion: rnInstall.version,
    reactNativeGestureHandlerVersion: REACT_NATIVE_GESTURE_HANDLER_VERSION,
    vectorIcons: false,
    animatable: false,
    i18n: false,
    includeDetox,
  }
  await ignite.copyBatch(toolbox, templates, templateProps, {
    quiet: true,
    directory: `${ignite.ignitePluginPath()}/boilerplate`,
  })

  await ignite.setIgniteConfig("navigation", "react-navigation")

  /**
   * Because of https://github.com/react-native-community/cli/issues/462,
   * we can't detox-test the release configuration. Turn on dead-code stripping
   * to fix this.
   */
  if (includeDetox) {
    await ignite.patchInFile(`ios/${name}.xcodeproj/xcshareddata/xcschemes/${name}.xcscheme`, {
      replace: 'buildForRunning = "YES"\n            buildForProfiling = "NO"',
      insert: 'buildForRunning = "NO"\n            buildForProfiling = "NO"',
    })
  }

  /**
   * Append to files
   */
  // https://github.com/facebook/react-native/issues/12724
  filesystem.appendAsync(".gitattributes", "*.bat text eol=crlf")

  /**
   * Merge the package.json from our template into the one provided from react-native init.
   */
  async function mergePackageJsons() {
    // transform our package.json so we can replace variables
    ignite.log("merging Bowser package.json with React Native package.json")
    const rawJson = await template.generate({
      directory: `${ignite.ignitePluginPath()}/boilerplate`,
      template: "package.json.ejs",
      props: { ...templateProps, kebabName: strings.kebabCase(templateProps.name) },
    })
    const newPackageJson = JSON.parse(rawJson)

    // read in the react-native created package.json
    const currentPackage = filesystem.read("package.json", "json")

    // deep merge
    const newPackage = pipe(
      assoc("dependencies", merge(currentPackage.dependencies, newPackageJson.dependencies)),
      assoc(
        "devDependencies",
        merge(
          omit(["@react-native-community/eslint-config"], currentPackage.devDependencies),
          newPackageJson.devDependencies,
        ),
      ),
      assoc("scripts", merge(currentPackage.scripts, newPackageJson.scripts)),
      merge(__, omit(["dependencies", "devDependencies", "scripts"], newPackageJson)),
    )(currentPackage)

    // write this out
    ignite.log("writing newly merged package.json")
    filesystem.write("package.json", newPackage, { jsonIndent: 2 })
  }
  await mergePackageJsons()
  spinner.stop()

  // pass long the debug flag if we're running in that mode
  const debugFlag = parameters.options.debug ? "--debug" : ""

  try {
    // boilerplate adds itself to get plugin.js/generators etc
    // Could be directory, npm@version, or just npm name.  Default to passed in values
    ignite.log("adding boilerplate to project for generator commands")

    const boilerplate = parameters.options.b || parameters.options.boilerplate || "ignite-bowser"
    await system.exec(`ignite add ${boilerplate} ${debugFlag}`)

    ignite.log("adding react-native-gesture-handler")
    await ignite.addModule("react-native-gesture-handler", {
      version: REACT_NATIVE_GESTURE_HANDLER_VERSION,
    })

    ignite.log("patching MainActivity.java to add RNGestureHandler")

    ignite.patchInFile(
      `${process.cwd()}/android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`,
      {
        after: "import com.facebook.react.ReactActivity;",
        insert: `
      import com.facebook.react.ReactActivityDelegate;
      import com.facebook.react.ReactRootView;
      import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;`,
      },
    )
    ignite.patchInFile(
      `${process.cwd()}/android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`,
      {
        after: `public class MainActivity extends ReactActivity {`,
        insert:
          "\n  @Override\n" +
          "  protected ReactActivityDelegate createReactActivityDelegate() {\n" +
          "    return new ReactActivityDelegate(this, getMainComponentName()) {\n" +
          "      @Override\n" +
          "      protected ReactRootView createRootView() {\n" +
          "       return new RNGestureHandlerEnabledRootView(MainActivity.this);\n" +
          "      }\n" +
          "    };\n" +
          "  }",
      },
    )

    ignite.log("patching package.json to add solidarity postInstall")
    ignite.patchInFile(`${process.cwd()}/package.json`, {
      replace: `"postinstall": "solidarity",`,
      insert: `"postinstall": "node ./bin/postInstall",`,
    })
  } catch (e) {
    ignite.log(e)
    print.error(`
      There were errors while generating the project. Run with --debug to see verbose output.
    `)
    throw e
  }

  // re-run yarn; will also install pods, because of our postInstall script.
  const installDeps = ignite.useYarn ? "yarn" : "npm install"
  await system.run(installDeps)
  spinner.succeed(`Installed dependencies`)

  // run react-native link to link assets
  await system.exec("npx react-native link")
  spinner.succeed(`Linked assets`)

  // for Windows, fix the settings.gradle file. Ref: https://github.com/oblador/react-native-vector-icons/issues/938#issuecomment-463296401
  // for ease of use, just replace any backslashes with forward slashes
  if (isWindows) {
    ignite.log("patching Android settings.gradle file for running on Windows")
    await patching.update(`${process.cwd()}/android/settings.gradle`, contents => {
      return contents.split("\\").join("/")
    })
  }

  // let eslint and prettier clean things up
  ignite.log("linting")
  await system.spawn(`${ignite.useYarn ? "yarn" : "npm run"} lint`)
  ignite.log("formatting")
  await system.spawn(`${ignite.useYarn ? "yarn" : "npm run"} format`)
  spinner.succeed("Linted and formatted")

  const perfDuration = (new Date().getTime() - perfStart) / 10 / 100
  spinner.succeed(`ignited ${yellow(name)} in ${perfDuration}s`)

  const androidInfo = isAndroidInstalled(toolbox)
    ? ""
    : `\n\nTo run in Android, make sure you've followed the latest react-native setup instructions at https://facebook.github.io/react-native/docs/getting-started.html before using ignite.\nYou won't be able to run ${bold(
        "react-native run-android",
      )} successfully until you have.`

  const successMessage = `
    ${red("Ignite CLI")} ignited ${yellow(name)} in ${gray(`${perfDuration}s`)}

    To get started:

      cd ${name}
      npx react-native run-ios
      npx react-native run-android${androidInfo}
      ignite --help

    ${cyan("Need additional help? Join our Slack community at http://community.infinite.red.")}

    ${bold("Now get cooking! 🍽")}

    ${gray(
      "(Running yarn install one last time to make sure everything is installed -- please be patient!)",
    )}
  `

  print.info(successMessage)
}
