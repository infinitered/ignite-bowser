const { merge, pipe, assoc, omit, __ } = require('ramda')
const { getReactNativeVersion } = require('./lib/react-native-version')

/**
 * Is Android installed?
 *
 * $ANDROID_HOME/tools folder has to exist.
 *
 * @param {*} context - The gluegun context.
 * @returns {boolean}
 */
const isAndroidInstalled = function(context) {
  const androidHome = process.env['ANDROID_HOME']
  const hasAndroidEnv = !context.strings.isBlank(androidHome)
  const hasAndroid = hasAndroidEnv && context.filesystem.exists(`${androidHome}/tools`) === 'dir'

  return Boolean(hasAndroid)
}

/**
 * Let's install.
 *
 * @param {any} context - The gluegun context.
 */
async function install(context) {
  const {
    filesystem,
    parameters,
    ignite,
    reactNative,
    print,
    system,
    template,
    prompt,
    patching
  } = context
  const { colors } = print
  const { red, yellow, bold, gray, blue, cyan } = colors
  const isWindows = process.platform === 'win32'
  const isMac = process.platform === 'darwin'

  const perfStart = new Date().getTime()

  const name = parameters.first
  const spinner = print
    .spin(`using the ${red('Infinite Red')} boilerplate v3 (code name 'Bowser')`)
    .succeed()

  // attempt to install React Native or die trying
  let rnInstall = undefined
  rnInstall = await reactNative.install({
    name,
    version: getReactNativeVersion(context),
    useNpm: true // CI seems to die without it
  })
  if (rnInstall.exitCode > 0) process.exit(rnInstall.exitCode)

  // remove the __tests__ directory, App.js, and unnecessary config files that come with React Native
  const filesToRemove = ['__tests__', 'App.js', '.babelrc', '.flowconfig', '.buckconfig']
  filesToRemove.map(filesystem.remove)

  let includeDetox = false
  if (isMac) {
    const askAboutDetox = parameters.options.detox === undefined
    includeDetox = askAboutDetox
      ? await prompt.confirm('Would you like to include Detox end-to-end tests?')
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

  // copy our App, Tests & storybook directories
  spinner.text = '▸ copying files'
  spinner.start()
  filesystem.copy(`${__dirname}/boilerplate/app`, `${process.cwd()}/app`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/boilerplate/test`, `${process.cwd()}/test`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/boilerplate/storybook`, `${process.cwd()}/storybook`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  filesystem.copy(`${__dirname}/boilerplate/bin`, `${process.cwd()}/bin`, {
    overwrite: true
  })
  includeDetox &&
    filesystem.copy(`${__dirname}/boilerplate/e2e`, `${process.cwd()}/e2e`, {
      overwrite: true,
      matching: '!*.ejs'
    })
  spinner.stop()

  // generate some templates
  spinner.text = '▸ generating files'
  //
  const templates = [
    { template: 'index.js.ejs', target: 'index.js' },
    { template: 'README.md', target: 'README.md' },
    { template: 'ignite.json.ejs', target: 'ignite/ignite.json' },
    { template: '.gitignore.ejs', target: '.gitignore' },
    { template: '.prettierignore', target: '.prettierignore' },
    { template: '.solidarity', target: '.solidarity' },
    { template: '.babelrc', target: '.babelrc' },
    { template: 'tsconfig.json', target: 'tsconfig.json' },
    { template: 'app/app.tsx.ejs', target: 'app/app.tsx' },
    {
      template: 'app/screens/first-example-screen/first-example-screen.tsx.ejs',
      target: 'app/screens/first-example-screen/first-example-screen.tsx'
    },
    {
      template: 'app/screens/second-example-screen/second-example-screen.tsx.ejs',
      target: 'app/screens/second-example-screen/second-example-screen.tsx'
    }
  ]
  const templateProps = {
    name,
    igniteVersion: ignite.version,
    reactNativeVersion: rnInstall.version,
    vectorIcons: false,
    animatable: false,
    i18n: false,
    includeDetox
  }
  await ignite.copyBatch(context, templates, templateProps, {
    quiet: true,
    directory: `${ignite.ignitePluginPath()}/boilerplate`
  })

  /**
   * Append to files
   */
  // https://github.com/facebook/react-native/issues/12724
  filesystem.appendAsync('.gitattributes', '*.bat text eol=crlf')

  /**
   * Merge the package.json from our template into the one provided from react-native init.
   */
  async function mergePackageJsons() {
    // transform our package.json in case we need to replace variables
    const rawJson = await template.generate({
      directory: `${ignite.ignitePluginPath()}/boilerplate`,
      template: 'package.json.ejs',
      props: templateProps
    })
    const newPackageJson = JSON.parse(rawJson)

    // read in the react-native created package.json
    const currentPackage = filesystem.read('package.json', 'json')

    // deep merge, lol
    const newPackage = pipe(
      assoc('dependencies', merge(currentPackage.dependencies, newPackageJson.dependencies)),
      assoc(
        'devDependencies',
        merge(currentPackage.devDependencies, newPackageJson.devDependencies)
      ),
      assoc('scripts', merge(currentPackage.scripts, newPackageJson.scripts)),
      merge(__, omit(['dependencies', 'devDependencies', 'scripts'], newPackageJson))
    )(currentPackage)

    // write this out
    filesystem.write('package.json', newPackage, { jsonIndent: 2 })
  }
  await mergePackageJsons()
  spinner.stop()

  // pass long the debug flag if we're running in that mode
  const debugFlag = parameters.options.debug ? '--debug' : ''

  try {
    // boilerplate adds itself to get plugin.js/generators etc
    // Could be directory, npm@version, or just npm name.  Default to passed in values
    const boilerplate = parameters.options.b || parameters.options.boilerplate || 'ignite-bowser'

    await system.spawn(`ignite add ${boilerplate} ${debugFlag}`, { stdio: 'inherit' })

    // react native link -- must use spawn & stdio: ignore or it hangs!! :(
    spinner.text = `▸ linking native libraries`
    spinner.start()
    await system.spawn('react-native link', { stdio: 'ignore' })
    spinner.stop()

    await ignite.addModule('react-native-gesture-handler', { version: '1.1.0', link: true })

    ignite.patchInFile(
      `${process.cwd()}/android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`,
      {
        after: 'import com.facebook.react.ReactActivity;',
        insert: `
      import com.facebook.react.ReactActivityDelegate;
      import com.facebook.react.ReactRootView;
      import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;`
      }
    )

    ignite.patchInFile(
      `${process.cwd()}/android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`,
      {
        after: `public class MainActivity extends ReactActivity {`,
        insert:
          '\n  @Override\n' +
          '  protected ReactActivityDelegate createReactActivityDelegate() {\n' +
          '    return new ReactActivityDelegate(this, getMainComponentName()) {\n' +
          '      @Override\n' +
          '      protected ReactRootView createRootView() {\n' +
          '       return new RNGestureHandlerEnabledRootView(MainActivity.this);\n' +
          '      }\n' +
          '    };\n' +
          '  }'
      }
    )
  } catch (e) {
    ignite.log(e)
    print.error(`
      There were errors when we were generating the project. Run with --debug to see verbose output.
    `)
    throw e
  }

  // git configuration
  const gitExists = await filesystem.exists('./.git')
  if (!gitExists && !parameters.options['skip-git'] && system.which('git')) {
    // initial git
    const spinner = print.spin('configuring git')

    // TODO: Make husky hooks optional
    const huskyCmd = '' // `&& node node_modules/husky/bin/install .`
    await system.run(`git init . && git add . && git commit -m "Initial commit." ${huskyCmd}`)

    spinner.succeed(`configured git`)
  }

  // re-run yarn
  const installDeps = ignite.useYarn ? 'yarn' : 'npm install'
  await system.run(installDeps)
  spinner.succeed(`Installed dependencies`)

  // re-run react-native link
  await system.spawn('react-native link', { stdio: 'ignore' })
  spinner.succeed(`Linked dependencies`)

  // for Windows, fix the settings.gradle file. Ref: https://github.com/oblador/react-native-vector-icons/issues/938#issuecomment-463296401
  // for ease of use, just replace any backslashes with forward slashes
  if (isWindows) {
    await patching.update(`${process.cwd()}/android/settings.gradle`, contents => {
      return contents.split('\\').join('/')
    })
  }

  const perfDuration = parseInt((new Date().getTime() - perfStart) / 10) / 100
  spinner.succeed(`ignited ${yellow(name)} in ${perfDuration}s`)

  const androidInfo = isAndroidInstalled(context)
    ? ''
    : `\n\nTo run in Android, make sure you've followed the latest react-native setup instructions at https://facebook.github.io/react-native/docs/getting-started.html before using ignite.\nYou won't be able to run ${bold(
        'react-native run-android'
      )} successfully until you have.`

  const successMessage = `
    ${red('Ignite CLI')} ignited ${yellow(name)} in ${gray(`${perfDuration}s`)}

    To get started:

      cd ${name}
      react-native run-ios
      react-native run-android${androidInfo}
      ignite --help

    ${cyan('Need additional help? Join our Slack community at http://community.infinite.red.')}

    ${bold('Now get cooking! 🍽')}

    ${gray(
      '(Running yarn install one last time to make sure everything is installed -- please be patient!)'
    )}
  `

  print.info(successMessage)
}

module.exports = {
  install
}
