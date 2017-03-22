// @cliDescription  Generates an opinionated container.

module.exports = async function (context) {
  // grab some features
  const { parameters, print, strings, ignite, filesystem } = context
  const { pascalCase, isBlank } = strings
  const config = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate screen <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const props = { name }

  const jobs = [
    {
      template: `screen.ejs`,
      target: `App/Containers/${name}Screen.js`
    },
    {
      template: `screen-style.ejs`,
      target: `App/Containers/Styles/${name}ScreenStyle.js`
    }
  ]

  // make the templates
  await ignite.copyBatch(context, jobs, props)

  // if using `react-navigation` go the extra step
  // and insert the screen into the nav router
  if (config.navigation === 'react-navigation') {
    const screenName = `${name}Screen`
    const appNavFilePath = `${process.cwd()}/App/Navigation/AppNavigation.js`
    const importToAdd = `import ${screenName} from '../Containers/${screenName}'`
    const routeToAdd = `  ${screenName}: { screen: ${screenName} },`

    if (!filesystem.exists(appNavFilePath)) {
      const msg = `No '${appNavFilePath}' file found.  Can't insert screen.`
      print.error(msg)
      process.exit(1)
    }

    // insert screen import
    ignite.patchInFile(appNavFilePath, {
      after: 'import { StackNavigator } from',
      insert: importToAdd
    })

    // insert screen route
    ignite.patchInFile(appNavFilePath, {
      after: 'const PrimaryNav',
      insert: routeToAdd
    })
  } else {
    print.log('Screen created, manually add it to your navigation')
  }
}
