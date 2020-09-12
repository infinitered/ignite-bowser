/**
 * This function is executed by Ignite CLI after initializing a new project.
 * The file will be deleted automatically afterward.
 */

module.exports = {
  cleanup: async (toolbox, props) => {
    const { print, filesystem, ignite } = toolbox

    if (props.boilerplate.nickname === "bowser-expo") {
      // Additional setup for Expo
      print.info("Adding Expo packages...")

      const cwd = filesystem.cwd()
      process.chdir(__dirname)

      await ignite.packager.add("expo", { dev: false, expo: true })
      await ignite.packager.add("react-native", { dev: false, expo: true })

      process.chdir(cwd)
    }
  },
}
