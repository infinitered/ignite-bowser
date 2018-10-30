// @cliDescription  Generates an opinionated container.

const patterns = require('../lib/patterns')

module.exports = async function (context) {
  // grab some features
  const { parameters, print, strings, ignite, filesystem, prompt } = context
  const { pascalCase, isBlank, camelCase } = strings
  const config = ignite.loadIgniteConfig()
  const options = parameters.options || {}
  const folder = options.folder || options.f

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate screen <name>\n`)
    print.info('A name is required.')
    return
  }

  const domains = filesystem.list('./src/views/')
  const domainChoices = ['(Create New)', ...domains]
  let domainAddAnswer = {}
  let domainPath = ''
  if (!folder) {
    const domainQuestion = 'Add screen to which domain?'
    domainAddAnswer = await prompt.ask({
      name: 'domain',
      type: 'list',
      message: domainQuestion,
      choices: domainChoices
    })
    domainPath = (domainAddAnswer.domain === domainChoices[0]) ? '' : domainAddAnswer.domain + '/'
  } else {
    domainPath = (folder === 'views') ? '' : folder + '/'
  }

  const name = parameters.first
  const screenName = name.endsWith('-screen') ? name : `${name}-screen`
  if (name.endsWith('-screen')) {
    print.info(`Note: For future reference, the \`-screen\` suffix is automatically added for you.`)
    print.info(`You're welcome to add it manually, but we wanted you to know you don't have to. :)`)
  }
  const pascalName = pascalCase(name)
  const camelName = camelCase(name)
  const newDomain = isBlank(domainPath)
  const sharedComponent = domainPath === 'shared/'

  const props = { name: screenName, pascalName, camelName, newDomain, sharedComponent }
  const jobs = [
    {
      template: `screen.ejs`,
      target: `src/views/${domainPath}${name}/${screenName}.tsx`
    }, {
      template: 'rollup-index.ts.ejs',
      target: `src/views/${domainPath}${name}/index.ts`
    }
  ]

  // make the templates
  await ignite.copyBatch(context, jobs, props)

  // if using `react-navigation` go the extra step
  // and insert the screen into the nav router
  if (config.navigation === 'react-navigation') {
    const appNavFilePath = `${process.cwd()}/src/navigation/root-navigator.ts`
    const importToAdd = `import { ${pascalName} } from "../views/${domainPath}${name}/${screenName}"`
    const routeToAdd = `    ${camelName}: { screen: ${pascalName} },`

    if (!filesystem.exists(appNavFilePath)) {
      const msg = `No '${appNavFilePath}' file found.  Can't insert screen.`
      print.error(msg)
      process.exit(1)
    }

    // insert screen import
    ignite.patchInFile(appNavFilePath, {
      after: patterns[patterns.constants.PATTERN_IMPORTS],
      insert: importToAdd
    })

    // insert screen route
    ignite.patchInFile(appNavFilePath, {
      after: patterns[patterns.constants.PATTERN_ROUTES],
      insert: routeToAdd
    })
  } else {
    print.info(`Screen ${screenName} created, manually add it to your navigation`)
  }
}
