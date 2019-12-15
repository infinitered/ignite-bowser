import { GluegunToolbox } from "gluegun"
import { Patterns } from "../../lib/patterns"

export const description = "Generates a React Navigation navigator."
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const {
    parameters,
    print,
    strings: { pascalCase, isBlank, camelCase, kebabCase },
    ignite,
    filesystem,
    patching,
    prompt: { ask },
    filesystem: { list },
  } = toolbox

  // prettier-ignore
  const navigatorTypes = {
    Stack: "createStackNavigator",
    Tab: "createBottomTabNavigator",
    Switch: "createSwitchNavigator",
    Drawer: "createDrawerNavigator",
    'Material Bottom Tab': "createMaterialBottomTabNavigator",
    'Material Top Tab': "createMaterialTopTabNavigator"
  }

  // validation
  if (isBlank(parameters.first)) {
    print.info("A name is required.")
    print.info(`ignite generate navigator <name>\n`)
    return
  }

  // grab the closest package.json
  const { packageJson } = await require("read-pkg-up")()
  if (!packageJson) {
    print.error(`Can't find a package.json here or in parent directories.`)
    return
  }

  // ensure react-navigation is installed
  if (Object.keys(packageJson.dependencies).includes("react-navigation") === false) {
    print.error("This generator only works with react-navigation.")
    return
  }

  const name = parameters.first
  const navigatorName = name.endsWith("-navigator") ? name : `${name}-navigator`

  // prettier-ignore
  if (name.endsWith('-navigator')) {
    print.info(`Note: For future reference, the \`-navigator\` suffix is automatically added for you.`)
    print.info(`You're welcome to add it manually, but we wanted you to know you don't have to. :)`)
  }

  // get permutations of the given navigator name
  const pascalName = pascalCase(navigatorName)
  const camelName = camelCase(navigatorName)

  // what navigator type to generate?
  let navigatorType = parameters.options.type
  if (!navigatorType) {
    const askForNavigatorType = {
      type: "select",
      name: "navigatorType",
      message: "What type of navigator do you want to create?",
      initial: "Stack",
      choices: Object.keys(navigatorTypes),
    }

    const result = await ask(askForNavigatorType)
    navigatorType = result.navigatorType
  }

  // which screens to include in the new navigator?
  let pascalScreens = parameters.options.screens && parameters.options.screens.split(",")
  if (!pascalScreens) {
    const allKebabScreens = list(`${process.cwd()}/app/screens/`)
      .filter(s => !RegExp("index").test(s))
      .map(s => s.replace(/\..{0,3}/, ""))
    const allPascalScreens = allKebabScreens.map(s => pascalCase(s))

    if (allKebabScreens) {
      const askForScreens = {
        type: "multiselect",
        name: "screens",
        message: "What screens would you like to import to the navigator?",
        choices: allPascalScreens,
      }

      const result = await ask(askForScreens)
      pascalScreens = result.screens
    }
  }

  // which screens to include in navigator?
  let pascalNavigators =
    parameters.options.navigators && parameters.options.navigators.split(",")
  if (!pascalNavigators) {
    const allKebabNavigators = list(`${process.cwd()}/app/navigation/`).filter(
      n => n.includes("-navigator.") && !n.includes("stateful-") && !n.includes("root-"),
    )
    const allPascalNavigators = allKebabNavigators.map(s =>
      pascalCase(s.replace(".tsx", "").replace(".ts", "")),
    )

    if (allPascalNavigators) {
      const askForNavigators = {
        type: "multiselect",
        name: "navigators",
        message: "What other navigators would you like to import to the navigator?",
        choices: allPascalNavigators,
      }

      const result = await ask(askForNavigators)
      pascalNavigators = result.navigators
    }
  }

  const props = {
    name: navigatorName,
    pascalName,
    camelName,
    navigatorType: navigatorTypes[navigatorType],
  }
  const jobs = [
    {
      template: `navigator.ejs`,
      target: `app/navigation/${navigatorName}.ts`,
    },
  ]

  // make the template
  await ignite.copyBatch(toolbox, jobs, props)

  // import screens/navigators to newly created navigator
  if (!!pascalScreens.length || !!pascalNavigators.length) {
    const navFilePath = `${process.cwd()}/app/navigation/${navigatorName}.ts`

    if (!filesystem.exists(navFilePath)) {
      const msg =
        `No '${navFilePath}' file found.  Can't insert screen.` +
        `Something went wrong with the navigator generator.`
      print.error(msg)
      process.exit(1)
    }

    const screenImport = pascalScreens.join(",\n  ")
    await patching.patch(navFilePath, {
      before: new RegExp(Patterns.NAV_IMPORTS_SCREENS),
      insert: `  ${screenImport},\n`,
    })

    const navigatorImports = pascalNavigators.map(pascalNavigator => {
      const kebabNavigator = kebabCase(pascalNavigator)
      return `\nimport { ${pascalNavigator} } from "./${kebabNavigator}"`
    })

    const toImport = navigatorImports.join("")

    await patching.patch(navFilePath, {
      after: new RegExp(Patterns.NAV_IMPORTS_NAVIGATORS),
      insert: toImport,
    })

    // insert routes
    const routes = [...pascalScreens, ...pascalNavigators]
      .map(pascalItem => {
        const camelItem = camelCase(pascalItem)
        return `\n  ${camelItem
          .replace("Screen", "")
          .replace("Navigator", "")}: { screen: ${pascalItem} },`
      })
      .join("")

    await patching.patch(navFilePath, {
      after: new RegExp(Patterns.NAV_ROUTES),
      insert: routes,
    })
  }
}
