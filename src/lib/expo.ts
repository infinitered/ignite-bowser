import { IgniteToolbox, IgniteRNInstallResult } from "../types"

// error codes
const exitCodes = {
  EXPO_NOT_FOUND: 1,
}

type ExpoInstallParams = { name: string; toolbox: IgniteToolbox }

export const expo = {
  async install({ name, toolbox }: ExpoInstallParams): Promise<IgniteRNInstallResult> {
    const { system, ignite, print, filesystem, parameters } = toolbox
    const { gray } = print.colors

    const printInfo = info =>
      print.info(
        gray(
          "  " +
            info
              .split("\n")
              .map(s => s.trim())
              .join("\n  "),
        ),
      )

    const perfStart = new Date().getTime()

    let expoVersion: string
    try {
      const cmd = `npx expo-cli --version`
      ignite.log(`command: ${cmd}`)
      expoVersion = (await system.run(cmd)).trim()
    } catch (e) {
      ignite.log(e)

      printInfo(`
        You don't appear to have Expo CLI installed.
        Run \`npm install -g expo-cli\` or \`yarn global add expo-cli\` to install and try again.
      `)
      process.exit(exitCodes.EXPO_NOT_FOUND)
    }

    const spinner = print.spin(
      `initializing ${print.colors.cyan(
        `Expo app (CLI version ${expoVersion})`,
      )} ${print.colors.muted(" (30 seconds-ish)")}`,
    )
    if (parameters.options.debug) spinner.stop()

    const cmd = `npx expo-cli init ${name} --name=${name} --template=blank ${
      ignite.useYarn ? "--yarn" : ""
    }`
    ignite.log(`command: ${cmd}`)
    const expoInstall = await system.spawn(cmd)

    const perfDuration = parseInt(((new Date().getTime() - perfStart) / 10).toString(), 10) / 100
    const successMessage = `initialized ${print.colors.cyan("Expo app ")} in ${perfDuration}s`
    spinner.succeed(successMessage)

    // jump immediately into the new directory
    process.chdir(name)
    ignite.log(`changed to directory ${process.cwd()}`)

    // Create ./ignite/plugins/.gitkeep
    filesystem.write(`${process.cwd()}/ignite/plugins/.gitkeep`, "")

    return {
      exitCode: expoInstall.status,
      version: `expo-cli@${expoVersion}`,
      template: "ignite-bowser",
    }
  },
}
