// @cliDescription  Generates a screen with a ListView/Flatlist/SectionList + walkthrough.

const patterns = require('../lib/patterns')

module.exports = async function (context) {
  // grab some features
  const { print, parameters, strings, ignite, filesystem } = context
  const { pascalCase, isBlank } = strings
  const config = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate list <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const props = { name }

  // which type of list in code
  const typeCodeMessage = 'What coding style do you want for your list?'
  const typeCodeChoices = ['Flatlist (new)', 'Listview (classic)']

  // which type of layout?
  const typeMessage = 'What kind of List would you like to generate?'
  const typeChoices = ['Row', 'Grid']

  // Sections or no?
  const typeDataMessage = 'How will your data be presented on this list?'
  const typeDataChoices = ['Single', 'Sectioned']

  // Check for parameters to bypass questions
  let typeCode = parameters.options.codeType
  let type = parameters.options.type
  let dataType = parameters.options.dataType

  // only prompt if type is not defined
  if (!typeCode) {
    // as question 1
    const codeAnswers = await context.prompt.ask({
      name: 'type',
      type: 'list',
      message: typeCodeMessage,
      choices: typeCodeChoices
    })
    typeCode = codeAnswers.type === typeCodeChoices[0] ? 'flatlist' : 'listview'
  }

  if (!type) {
    // ask question 2
    const answers = await context.prompt.ask({
      name: 'type',
      type: 'list',
      message: typeMessage,
      choices: typeChoices
    })
    type = answers.type
  }

  if (!dataType) {
    // ask question 3
    const dataAnswers = await context.prompt.ask({
      name: 'type',
      type: 'list',
      message: typeDataMessage,
      choices: typeDataChoices
    })
    dataType = dataAnswers.type
  }

  // Sorry the following is so confusing, but so are React Native lists
  // There are 3 options and therefore 8 possible combinations
  let componentTemplate = dataType.toLowerCase() === 'sectioned'
    ? typeCode + '-sections'
    : typeCode
  let styleTemplate = ''
  // Different logic depending on code types
  if (typeCode === 'flatlist') {
    /*
    * The following mess is because FlatList supports numColumns
    * where SectionList does not.
    */
    if (type.toLowerCase() === 'grid' && dataType.toLowerCase() === 'sectioned') {
      // grid + section means we need wrap
      styleTemplate = 'listview-grid-style'
    } else if (type.toLowerCase() === 'grid') {
      componentTemplate = componentTemplate + '-grid'
      // grid + single = no wrap, use columns
      styleTemplate = 'flatlist-grid-style'
    } else {
      // no grids, flatlist basic
      styleTemplate = 'listview-style'
    }
  } else {
    // listview builder
    styleTemplate = type.toLowerCase() === 'grid'
      ? 'listview-grid-style'
      : 'listview-style'
  }

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
      const msg = `No '${appNavFilePath}' file found.  Can't insert list screen.`
      print.error(msg)
      process.exit(1)
    }

    // insert list screen import
    ignite.patchInFile(appNavFilePath, {
      after: patterns[patterns.constants.PATTERN_IMPORTS],
      insert: importToAdd
    })

    // insert list screen route
    ignite.patchInFile(appNavFilePath, {
      after: patterns[patterns.constants.PATTERN_ROUTES],
      insert: routeToAdd
    })
  } else {
    print.info('List screen created, manually add it to your navigation')
  }
}
