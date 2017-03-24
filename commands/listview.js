// @cliDescription  Generates a screen with a ListView + walkthrough.

module.exports = async function (context) {
  // grab some features
  const { print, parameters, strings, ignite, filesystem } = context
  const { pascalCase, isBlank } = strings
  const config = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate listview <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const props = { name }

  // which type of grid?
  const message = 'What kind of ListView would you like to generate?'
  const choices = ['Row', 'With Sections', 'Grid']

  // pick one
  let type = parameters.options.type
  if (!type) {
    const answers = await context.prompt.ask({
      name: 'type',
      type: 'list',
      message,
      choices
    })
    type = answers.type
  }

  // set appropriate templates to generate
  const componentTemplate = type === 'With Sections'
    ? 'listview-sections'
    : 'listview'
  const styleTemplate = type === 'Grid'
    ? 'listview-grid-style'
    : 'listview-style'

  const jobs = [
    {
      template: `${componentTemplate}.ejs`,
      target: `App/Containers/${name}.js`
    },
    {
      template: `${styleTemplate}.ejs`,
      target: `App/Containers/Styles/${name}Style.js`
    }
  ]

  await ignite.copyBatch(context, jobs, props)

  // if using `react-navigation` go the extra step
  // and insert the screen into the nav router
  if (config.navigation === 'react-navigation') {
    const screenName = `${name}`
    const appNavFilePath = `${process.cwd()}/App/Navigation/AppNavigation.js`
    const importToAdd = `import ${screenName} from '../Containers/${screenName}'`
    const routeToAdd = `  ${screenName}: { screen: ${screenName} },`

    if (!filesystem.exists(appNavFilePath)) {
      const msg = `No '${appNavFilePath}' file found.  Can't insert listview screen.`
      print.error(msg)
      process.exit(1)
    }

    // insert listview screen import
    ignite.patchInFile(appNavFilePath, {
      after: 'import { StackNavigator } from',
      insert: importToAdd
    })

    // insert listview screen route
    ignite.patchInFile(appNavFilePath, {
      after: 'const PrimaryNav',
      insert: routeToAdd
    })
  } else {
    print.log('Listview screen created, manually add it to your navigation')
  }
}
