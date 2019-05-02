const screenExamples = []

/**
 * Add the plugin.
 *
 * @param {any} context - The gluegun context.
 */
async function add(context) {
  // examples of generated screens
  await context.ignite.addPluginScreenExamples(screenExamples)
}

/**
 * Remove the plugin.
 *
 * @param {any} context - The gluegun context.
 */
async function remove(context) {
  // remove screens
  await context.ignite.removePluginScreenExamples(screenExamples)
}

module.exports = { add, remove }
