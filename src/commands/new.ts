import { GluegunToolbox } from "../types"
import { spawnProgress } from "../tools/spawn"
import { isAndroidInstalled } from "../tools/react-native"

export default {
  run: async (toolbox: GluegunToolbox) => {
    const { print, filesystem, system, meta, parameters } = toolbox
    const { path } = filesystem
    const { newline, info, colors } = print
    const { gray, red, magenta, cyan, bold, yellow } = colors

    // start tracking performance
    const perfStart = new Date().getTime()

    // retrieve project name from toolbox
    const { validateProjectName } = require("../tools/validations")
    const projectName = validateProjectName(toolbox)

    // debug?
    const debug = Boolean(parameters.options.debug)
    const log = m => (debug ? info(m) : undefined)

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
    newline()
    info(red("🔥 Ignite CLI 🔥"))
    newline()
    info(magenta(`Creating ${projectName} using Ignite Bowser ${meta.version()}...`))
    info(gray(`Using ${cli}`))

    // generate the project
    log(`Spawning process with "${cliString}"`)
    await spawnProgress(cliString, {
      onProgress: (out: string) => {
        out = out.toString()
        log(out)

        if (expo) {
          const { expoProgress } = require("../tools/progress")
          const prog = expoProgress(out)
          if (prog) print.info(prog)
        } else {
          const { cliProgress } = require("../tools/progress")
          const prog = cliProgress(out)
          if (prog) print.info(prog)
        }
      },
    })

    // note the original directory
    const cwd = process.cwd()
    log({ cwd })

    // jump into the project to do additional tasks
    process.chdir(projectName)
    log(`chdir to ${projectName}`)

    // copy the .gitignore if it wasn't copied over [expo...]
    const gitPath = path(process.cwd(), ".gitignore")
    if (!filesystem.exists(gitPath)) {
      filesystem.copy(path(boilerplatePath, ".gitignore"), gitPath)
    }

    // remove the ios and android folders if we're spinning up an Expo app
    if (expo) await Promise.all([filesystem.removeAsync("ios"), filesystem.removeAsync("android")])

    // TODO: add this package to provide generators and other functionality?
    // await packager.add(`ignite-bowser@${meta.version()}`)

    // TODO: finish installing packages?
    // await packager.install()

    // commit any changes
    if (parameters.options.git !== false) {
      log(`
        system.run:

        git init;
        git add -A;
        git commit -m "New Ignite Bowser app";
      `)
      await system.run(`
        \\rm -rf ./.git
        git init;
        git add -A;
        git commit -m "New Ignite Bowser app";
      `)
    }

    // back to the original directory
    process.chdir(cwd)
    log(`chdir: ${cwd}`)

    // we're done!
    const perfDuration = (new Date().getTime() - perfStart) / 10 / 100
    const androidInfo = isAndroidInstalled(toolbox)
      ? ""
      : `\n\nTo run in Android, make sure you've followed the latest react-native setup instructions at https://facebook.github.io/react-native/docs/getting-started.html before using ignite.\nYou won't be able to run ${bold(
          "react-native run-android",
        )} successfully until you have.`

    const runInfo = expo
      ? "yarn start"
      : `react-native run-ios\n        react-native run-android${androidInfo}`

    const successMessage = `
      ${red("Ignite CLI")} ignited ${yellow(projectName)} in ${gray(`${perfDuration}s`)}
      To get started:
        cd ${projectName}
        ${runInfo}
      ${cyan("Need additional help? Join our Slack community at http://community.infinite.red.")}
      ${bold("Now get cooking! 🍽")}
    `

    print.info(successMessage)
  },
}
