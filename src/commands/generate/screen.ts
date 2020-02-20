import { GluegunToolbox } from "gluegun"
import { Patterns } from "../../lib/patterns"

export const description = "Generates a React Native screen."
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const { parameters, print, strings, ignite, filesystem, patching } = toolbox
  const { pascalCase, isBlank, camelCase } = strings
  const config = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info("A name is required.")
    print.info(`ignite generate screen <name>\n`)
    return
  }

  const name = parameters.first
  const screenName = name.endsWith("-screen") ? name : `${name}-screen`

  // prettier-ignore
  if (name.endsWith('-screen')) {
    print.info(`Note: For future reference, the \`-screen\` suffix is automatically added for you.`)
    print.info(`You're welcome to add it manually, but we wanted you to know you don't have to. :)`)
  }

  // get permutations of the given model name
  const pascalName = pascalCase(screenName)
  const camelName = camelCase(screenName)

  const props = { name: screenName, pascalName, camelName }
  const jobs = [
    {
      template: `screen.ejs`,
      target: `app/screens/${screenName}/${screenName}.tsx`,
    },
  ]

  // make the templates
  await ignite.copyBatch(toolbox, jobs, props)

  // patch the barrel export file
  const barrelExportPath = `${process.cwd()}/app/screens/index.ts`
  const exportToAdd = `export * from "./${screenName}/${screenName}"\n`

  if (!filesystem.exists(barrelExportPath)) {
    const msg =
    `No '${barrelExportPath}' file found. Can't export screen.` +
    `Export your new screen manually.`
    print.warning(msg)
    process.exit(1)
  }
  await patching.append(barrelExportPath, exportToAdd)

  // if using `react-navigation` go the extra step
  // and insert the screen into the nav router
  if (config.navigation === "react-navigation") {
    const appNavFilePath = `${process.cwd()}/app/navigation/root-navigator.ts`
    const importToAdd = `  ${pascalName},\n`
    const routeToAdd = `\n    ${camelName}: { screen: ${pascalName} },`

    if (!filesystem.exists(appNavFilePath)) {
      const msg =
        `No '${appNavFilePath}' file found.  Can't insert screen.` +
        `Add your new screen manually to your navigation.`
      print.error(msg)
      process.exit(1)
    }

    // insert screen import
    await patching.patch(appNavFilePath, {
      before: new RegExp(Patterns.NAV_IMPORTS_SCREENS),
      insert: importToAdd,
    })

    // insert screen route
    await patching.patch(appNavFilePath, {
      after: new RegExp(Patterns.ROOT_NAV_ROUTES),
      insert: routeToAdd,
    })
  } else {
    print.info(`Screen ${screenName} created, manually add it to your navigation`)
  }
}
