const patterns = require('../../lib/patterns')

module.exports = {
  description: 'Generates a React Navigation navigator.',
  run: async function(toolbox) {
    // grab some features
    const {
      parameters,
      print,
      strings: { pascalCase, isBlank, camelCase, kebabCase },
      ignite,
      filesystem,
      patching,
      prompt: { ask },
      filesystem: { list }
    } = toolbox

    const config = ignite.loadIgniteConfig()

    // prettier-ignore
    const navigatorTypes = {
      'Stack': "createStackNavigator",
      'Tab': "createBottomTabNavigator",
      'Switch': "createSwitchNavigator",
      'Drawer': "createDrawerNavigator",
      'Material Bottom Tab': "createMaterialBottomTabNavigator",
      'Material Top Tab': "createMaterialTopTabNavigator"
    }

    // validation
    if (isBlank(parameters.first)) {
      print.info('A name is required.')
      print.info(`ignite generate navigator <name>\n`)
      return
    }

    // validation
    if (config.navigation !== 'react-navigation') {
      print.info('This generator only works with react-navigation.')
      return
    }

    const name = parameters.first
    const navigatorName = name.endsWith('-navigator') ? name : `${name}-navigator`

    // prettier-ignore
    if (name.endsWith('-navigator')) {
      print.info(`Note: For future reference, the \`-navigator\` suffix is automatically added for you.`)
      print.info(`You're welcome to add it manually, but we wanted you to know you don't have to. :)`)
    }

    // get permutations of the given navigator name
    const pascalName = pascalCase(navigatorName)
    const camelName = camelCase(navigatorName)

    const askForNavigatorType = {
      type: 'select',
      name: 'navigatorType',
      message: 'What type of navigator do you want to create?',
      initial: 'Stack',
      choices: Object.keys(navigatorTypes)
    }

    const { navigatorType } = await ask(askForNavigatorType)

    // get a list of current screens
    const allKebabScreens = list(`${process.cwd()}/app/screens/`)
    const allPascalScreens = !!allKebabScreens ? allKebabScreens.map(s => pascalCase(s)) : undefined
    let pascalScreens = []

    // ask which screens to include in navigator
    if (!!allKebabScreens) {
      const askForScreens = {
        type: 'multiselect',
        name: 'screens',
        message: 'What screens would you like to add to the navigator?',
        choices: allPascalScreens
      }

      result = await ask(askForScreens)
      pascalScreens = result.screens
    }

    const props = {
      name: navigatorName,
      pascalName,
      camelName,
      navigatorType: navigatorTypes[navigatorType]
    }
    const jobs = [
      {
        template: `navigator.ejs`,
        target: `app/navigation/${navigatorName}.ts`
      }
    ]

    // make the template
    await ignite.copyBatch(toolbox, jobs, props)

    // import screens to newly created navigator
    if (!!pascalScreens) {
      const navFilePath = `${process.cwd()}/app/navigation/${navigatorName}.ts`

      if (!filesystem.exists(navFilePath)) {
        const msg =
          `No '${navFilePath}' file found.  Can't insert screen.` +
          `Something went wrong with the navigator generator.`
        print.error(msg)
        process.exit(1)
        return
      }

      // insert screen import
      const imports = pascalScreens
        .map(pascalScreen => {
          const kebabScreen = kebabCase(pascalScreen)
          return `\nimport { ${pascalScreen} } from "../screens/${kebabScreen}"`
        })
        .join('')

      await patching.patch(navFilePath, {
        after: new RegExp(patterns[patterns.constants.PATTERN_NAV_IMPORTS]),
        insert: imports
      })

      // insert routes
      const routes = pascalScreens
        .map(pascalScreen => {
          const camelScreen = camelCase(pascalScreen)
          return `\n  ${camelScreen.replace('Screen', '')}: { screen: ${pascalScreen} },`
        })
        .join('')

      await patching.patch(navFilePath, {
        after: new RegExp(patterns[patterns.constants.PATTERN_NAV_ROUTES]),
        insert: routes
      })
    }
  }
}
