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
const isAndroidInstalled = function (context) {
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
async function install (context) {
  const {
    filesystem,
    parameters,
    ignite,
    reactNative,
    print,
    system,
    template
  } = context
  const { colors } = print
  const { red, yellow, bold, gray, blue } = colors

  const perfStart = (new Date()).getTime()

  const name = parameters.third
  const spinner = print
    .spin(`using the ${red('Infinite Red')} boilerplate v3 (code name 'Bowser')`)
    .succeed()

  // attempt to install React Native or die trying
  const rnInstall = await reactNative.install({
    name,
    version: getReactNativeVersion(context)
  })
  if (rnInstall.exitCode > 0) process.exit(rnInstall.exitCode)

  // remove the __tests__ directory and App.js that come with React Native
  filesystem.remove('__tests__')
  filesystem.remove('App.js')

  // copy our App, Tests & storybook directories
  spinner.text = '▸ copying files'
  spinner.start()
  filesystem.copy(`${__dirname}/boilerplate/src`, `${process.cwd()}/src`, {
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
  filesystem.copy(`${__dirname}/boilerplate/patches`, `${process.cwd()}/patches`, {
    overwrite: true,
    matching: '!*.ejs'
  })
  spinner.stop()

  // generate some templates
  spinner.text = '▸ generating files'
  const templates = [
    { template: 'index.js.ejs', target: 'index.js' },
    { template: 'README.md', target: 'README.md' },
    { template: 'ignite.json.ejs', target: 'ignite/ignite.json' },
    { template: '.editorconfig', target: '.editorconfig' },
    { template: '.babelrc', target: '.babelrc' },
    { template: '.prettierignore', target: '.prettierignore' },
    { template: '.prettierrc', target: '.prettierrc' },
    { template: '.solidarity', target: '.solidarity' },
    { template: 'rn-cli.config.js', target: 'rn-cli.config.js' },
    { template: 'tsconfig.json', target: 'tsconfig.json' },
    { template: 'tslint.json', target: 'tslint.json' },
    { template: 'src/app/main.tsx.ejs', target: 'src/app/main.tsx' }
  ]
  const templateProps = {
    name,
    igniteVersion: ignite.version,
    reactNativeVersion: rnInstall.version,
    vectorIcons: false,
    animatable: false,
    i18n: false
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
  async function mergePackageJsons () {
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
      assoc(
        'dependencies',
        merge(currentPackage.dependencies, newPackageJson.dependencies)
      ),
      assoc(
        'devDependencies',
        merge(currentPackage.devDependencies, newPackageJson.devDependencies)
      ),
      assoc('scripts', merge(currentPackage.scripts, newPackageJson.scripts)),
      merge(
        __,
        omit(['dependencies', 'devDependencies', 'scripts'], newPackageJson)
      )
    )(currentPackage)

    // write this out
    filesystem.write('package.json', newPackage, { jsonIndent: 2 })
  }
  await mergePackageJsons()
  spinner.stop()

  // pass long the debug flag if we're running in that mode
  const debugFlag = parameters.options.debug ? '--debug' : ''

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // NOTE(steve): I'm re-adding this here because boilerplates now hold permanent files
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  try {
    // boilerplate adds itself to get plugin.js/generators etc
    // Could be directory, npm@version, or just npm name.  Default to passed in values
    const boilerplate = parameters.options.b || parameters.options.boilerplate || 'ignite-ir-boilerplate-bowser'

    await system.spawn(`ignite add ${boilerplate} ${debugFlag}`, { stdio: 'inherit' })

    // react native link -- must use spawn & stdio: ignore or it hangs!! :(
    spinner.text = `▸ linking native libraries`
    spinner.start()
    await system.spawn('react-native link', { stdio: 'ignore' })
    spinner.stop()

    // patch splash screen
    async function patchSplashScreen () {
      spinner.text = `▸ setting up splash screen`
      spinner.start()
      spinner.text = `▸ setting up splash screen: configuring`
      const patchPath = `${process.cwd()}/patches/splash-screen/splash-screen.patch`
      const patch = filesystem.read(patchPath)
      const androidOldMainPathRegex = new RegExp('/android/app/src/main/java/com/SplashScreenPatch/MainActivity.java', 'g')
      const androidNewMainPath = `/android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`
      const androidPatch = patch.replace(androidOldMainPathRegex, androidNewMainPath)
      const patchForNewProject = androidPatch.replace(/SplashScreenPatch/g, name)
      filesystem.write(patchPath, patchForNewProject)
      spinner.text = `▸ setting up splash screen: cleaning`
      await system.run(`git apply ${patchPath}`, { stdio: 'ignore' })
      filesystem.remove(`${process.cwd()}/patches/splash-screen`)
    }
    await patchSplashScreen()
    spinner.stop()
  } catch (e) {
    ignite.log(e)
    throw e
  }

  // git configuration
  const gitExists = await filesystem.exists('./.git')
  if (!gitExists && !parameters.options['skip-git'] && system.which('git')) {
    // initial git
    const spinner = print.spin('configuring git')

    // TODO: Make husky hooks optional
    const huskyCmd = '' // `&& node node_modules/husky/bin/install .`
    system.run(`git init . && git add . && git commit -m "Initial commit." ${huskyCmd}`)

    spinner.succeed(`configured git`)
  }

  const perfDuration = parseInt(((new Date()).getTime() - perfStart) / 10) / 100
  spinner.succeed(`ignited ${yellow(name)} in ${perfDuration}s`)

  const androidInfo = isAndroidInstalled(context) ? ''
    : `\n\nTo run in Android, make sure you've followed the latest react-native setup instructions at https://facebook.github.io/react-native/docs/getting-started.html before using ignite.\nYou won't be able to run ${bold('react-native run-android')} successfully until you have.`

  const successMessage = `
    ${red('Ignite CLI')} ignited ${yellow(name)} in ${gray(`${perfDuration}s`)}

    To get started:

      cd ${name}
      react-native run-ios
      react-native run-android${androidInfo}
      ignite --help

    ${blue('Need additional help? Join our Slack community at http://community.infinite.red.')}

    ${bold('Now get cooking! 🍽')}
  `

  print.info(successMessage)
}

module.exports = {
  install
}
