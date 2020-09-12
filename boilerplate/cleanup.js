/**
 * This function is executed by Ignite CLI after initializing a new project.
 * The file will be deleted automatically afterward.
 */

module.exports = {
  cleanup: async (toolbox, props) => {
    const { print, filesystem, system, ignite } = toolbox

    if (props.boilerplate.nickname === "bowser-expo") {
      // Additional setup for Expo
      print.info("Adding Expo packages...")

      const cwd = filesystem.cwd()
      process.chdir(__dirname)

      await ignite.packager.add("expo")

      process.chdir(cwd)
    }

    print.info(props)
  },
}
