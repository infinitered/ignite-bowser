/**
 * This file will be loaded by Ignite CLI after initializing
 * a new project, and the exported `cleanup` function will run.
 * The file will be deleted automatically afterward.
 * This allows you to do additional setup, like
 */

module.exports = {
  cleanup: async (toolbox, props) => {
    const { print, filesystem, ignite } = toolbox

    if (props.expo) {
      // Additional setup for Expo
      print.info("Adding Expo packages...")

      const cwd = filesystem.cwd()
      process.chdir(__dirname)

      await ignite.packager.add("expo")
      await ignite.packager.add("react-native", { dev: false, expo: true })

      print.debug("Set up Unimodules!") // TODO: Set up unimodules automatically

      process.chdir(cwd)
    }
  },
}
