/**
 * This function is executed by Ignite CLI after initializing a new project.
 * The file will be deleted automatically afterward.
 */

export async function cleanup(toolbox, props) {
  const { print, filesystem } = toolbox

  print.info(props)
}
