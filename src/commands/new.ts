import { GluegunToolbox } from "../types"
import { packager } from "../tools/packager"

export default {
  run: async (toolbox: GluegunToolbox) => {
    const { print, system, filesystem, meta, parameters } = toolbox
    const { path } = filesystem
    const { newline, info, colors } = print
    const { validateProjectName } = require("../tools/validations")

    // retrieve project name from toolbox
    const projectName = validateProjectName(toolbox)

    // expo or no?
    const expo = Boolean(parameters.options.expo)
    const cli = expo ? "expo-cli" : "react-native-cli"
    const cliString = expo
      ? `npx expo-cli init ${projectName} --template ${path(`${meta.src}`, "..", "boilerplate")}`
      : `npx react-native init ${projectName} --template ${path(`${meta.src}`, "..")}`

    // welcome everybody!
    newline()
    info(colors.red("🔥 Ignite CLI 🔥"))
    newline()
    info(`Creating ${projectName} using Ignite Bowser ${meta.version()}...`)
    info(`Using ${cli}`)

    print.debug(cliString)

    // generate the project
    await system.spawn(cliString, { stdio: "inherit" })

    // note the original directory
    const cwd = process.cwd()

    // jump into the project to do additional tasks
    process.chdir(projectName)

    // add myself to provide generators and other functionality
    await packager.add(`ignite-bowser@${meta.version()}`)

    // finish installing packages
    // await packager.install()

    // back to the original directory
    process.chdir(cwd)
  },
}
