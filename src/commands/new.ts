import { GluegunToolbox } from "../types"
import { spawnProgress } from "../tools/spawn"
import { isAndroidInstalled } from "../tools/react-native"

export default {
  run: async (toolbox: GluegunToolbox) => {
    const { print, filesystem, system, meta, parameters } = toolbox
    const { path } = filesystem
    const { info, colors } = print
    const { gray, red, magenta, cyan, bold, yellow, white } = colors

    // start tracking performance
    const perfStart = new Date().getTime()

    // retrieve project name from toolbox
    const { validateProjectName } = require("../tools/validations")
    const projectName = validateProjectName(toolbox)

    // debug?
    const debug = Boolean(parameters.options.debug)
    const log = m => {
      if (debug) info(m)
      return m
    }
    const p = m => print.info(gray(`      ${m}`))

    // expo or no?
    const expo = Boolean(parameters.options.expo)
    const cli = expo ? "expo-cli" : "react-native-cli"
    const bowserPath = path(`${meta.src}`, "..")
    const boilerplatePath = path(bowserPath, "boilerplate")
    const cliString = expo
      ? `npx expo-cli init ${projectName} --template ${boilerplatePath}`
      : `npx react-native init ${projectName} --template ${bowserPath}`

    log({ expo, cli, bowserPath, boilerplatePath, cliString })

    // welcome everybody!
    p("\n")
    p(red("🔥 Ignite Bowser 🔥\n"))
    p(gray(`Creating ${magenta(projectName)} using ${red("Ignite Bowser")} ${meta.version()}`))
    p(gray(`Powered by ${red("Infinite Red")} - https://infinite.red`))
    p(gray(`Using ${cyan(cli)}`))
    p(gray(`──────────────────────────────────────────────\n`))
    p(`🔥 Igniting app`)

    // generate the project
    await spawnProgress(log(cliString), {
      onProgress: (out: string) => {
        out = log(out.toString())

        if (expo) {
          if (out.includes("Using Yarn")) p(`🪔 Summoning Expo CLI`)
          if (out.includes("project is ready")) p(`🎫 Cleaning up Expo install`)
        } else {
          if (out.includes("Welcome to React Native!")) p(`🖨  3D-printing a new React Native app`)
          if (out.includes("Run instructions for")) p(`🧊 Cooling print nozzles`)
        }
      },
    })

    // note the original directory
    const cwd = log(process.cwd())

    // jump into the project to do additional tasks
    process.chdir(projectName)

    // copy the .gitignore if it wasn't copied over [expo...]
    const gitPath = log(path(process.cwd(), ".gitignore"))
    if (!filesystem.exists(gitPath)) {
      filesystem.copy(path(boilerplatePath, ".gitignore"), gitPath)
    }

    // remove the ios and android folders if we're spinning up an Expo app
    if (expo) {
      await Promise.all([filesystem.removeAsync("ios"), filesystem.removeAsync("android")])
    }

    // TODO: add this package to provide generators and other functionality?
    // await packager.add(`ignite-bowser@${meta.version()}`)

    // TODO: finish installing packages?
    // await packager.install()

    // commit any changes
    if (parameters.options.git !== false) {
      p(`🖥  Setting up source control`)
      await system.run(
        log(`
          \\rm -rf ./.git
          git init;
          git add -A;
          git commit -m "New Ignite Bowser app";
        `),
      )
    }

    // back to the original directory
    process.chdir(log(cwd))

    // we're done!
    const perfDuration = (new Date().getTime() - perfStart) / 10 / 100
    const androidInfo = isAndroidInstalled(toolbox)
      ? ""
      : `\n\nTo run in Android, make sure you've followed the latest react-native setup instructions at https://facebook.github.io/react-native/docs/getting-started.html before using ignite.\nYou won't be able to run ${bold(
          "npx react-native run-android",
        )} successfully until you have.`

    const runInfo = expo ? "yarn start" : `npx react-native run-ios\n        npx react-native run-android${androidInfo}`

    p(`\n\n`)
    p(bold(white(`${red("Ignite CLI")} ignited ${yellow(projectName)} in ${gray(`${perfDuration}s`)}`)))
    p(`\n`)
    p(`To get started:`)
    p(`  cd ${projectName}`)
    p(`  ${runInfo}`)
    p(`\n`)
    p(cyan("Need additional help?"))
    p(cyan("Join our Slack community at http://community.infinite.red."))
    p(`\n`)
    p(bold(white("Now get cooking! 🍽")))
    p(`\n`)
  },
}
