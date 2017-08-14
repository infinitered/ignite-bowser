// @cliDescription  Deprecated - Use `list`

const patterns = require('../lib/patterns')

module.exports = async function (context) {
  const { print } = context
  const config = ignite.loadIgniteConfig()

  print.info(`Listview is now simply 'list' and supports multiple types of views.\n`)
  print.info(`Instead run: ${context.runtime.brand} generate list <name>\n`)
  print.info('This warning will be removed in a future release.')

  return
}
