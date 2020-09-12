/**
 * This function is executed by Ignite CLI after initializing a new project.
 * The file will be deleted automatically afterward.
 */

module.exports = {
  cleanup: async (toolbox, props) => {
    const { print, filesystem } = toolbox

    if (props.boilerplate.name.toLowerCase().includes("expo")) {
      print.info("Adding Expo packages...")
      // Additional setup for Expo
      await toolbox.ignite.add("expo")
    }

    print.info(props)
  },
}
