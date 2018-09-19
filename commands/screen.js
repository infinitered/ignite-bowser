// @cliDescription  Generates an opinionated container.

const patterns = require('../lib/patterns')
const domains = require('../lib/domains')

module.exports = async function (context) {
  // grab some features
  const { parameters, print, strings, ignite, filesystem } = context
  const { pascalCase, isBlank, camelCase } = strings
  const config = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate screen <name>\n`)
    print.info('A name is required.')
    return
  }

  const domainPath = await domains.getDomainPath('views', context)

  const name = parameters.first
  const screenName = name.endsWith('-screen') ? name : `${name}-screen`
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
