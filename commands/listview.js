// @cliDescription  Generates a screen with a ListView + walkthrough.

const patterns = require('../lib/patterns')

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

  // which type of layout?
  const typeMessage = 'What kind of ListView would you like to generate?'
  const typeChoices = ['Row', 'Grid']

  // Sections or no?
  const typeDataMessage = 'How will your data be presented on this listview?'
  const typeDataChoices = ['Single', 'Sectioned']

  // get type
  let type = parameters.options.type

  // get dataType
  let dataType = parameters.options.dataType

  // only prompt if type is not defined
  if (!type) {
    // as question 1
    const answers = await context.prompt.ask({
      name: 'type',
      type: 'list',
      message: typeMessage,
      choices: typeChoices
    })
    type = answers.type
    // ask question 2
    const dataAnswers = await context.prompt.ask({
      name: 'type',
      type: 'list',
      message: typeDataMessage,
      choices: typeDataChoices
    })
    dataType = dataAnswers.type
  }

  // set appropriate templates to generate
  const componentTemplate = dataType === 'Sectioned'
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
      after: patterns[patterns.constants.PATTERN_IMPORTS],
      insert: importToAdd
    })

    // insert listview screen route
    ignite.patchInFile(appNavFilePath, {
      after: patterns[patterns.constants.PATTERN_ROUTES],
      insert: routeToAdd
    })
  } else {
    print.info('Listview screen created, manually add it to your navigation')
  }
}
