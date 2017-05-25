const screenExamples = [
  {
    title: 'Row Example',
    screen: 'examples/RowExample.js.ejs',
    ancillary: ['examples/Styles/RowExampleStyle.js.ejs']
  },
  {
    title: 'Grid Example',
    screen: 'examples/GridExample.js.ejs',
    ancillary: ['examples/Styles/GridExampleStyle.js.ejs']
  },
  {
    title: 'Sections Example',
    screen: 'examples/SectionExample.js.ejs',
    ancillary: ['examples/Styles/SectionExampleStyle.js.ejs']
  }
]

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
