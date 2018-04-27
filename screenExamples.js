const screenExamples = []

/**
 * Adds the screen examples.
 *
 * @param {any} context The gluegun context.
 */
async function add (context) {
  // examples of generated screens
  await context.ignite.addPluginScreenExamples(screenExamples)
}

/**
 * Removes the screen examples.
 *
 * @param {any} context The gluegun context.
 */
async function remove (context) {
  // remove screens
  await context.ignite.removePluginScreenExamples(screenExamples)
}

module.exports = {
  add, remove
}
