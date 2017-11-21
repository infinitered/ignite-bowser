// @cliDescription  Generates a component, styles, and an optional test.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite } = context
  const { pascalCase, isBlank } = strings
  const config = ignite.loadIgniteConfig()
  const { tests } = config

  const options = parameters.options || {}

  const hasFolder = !isBlank(options.folder)

  // validation
  if (isBlank(parameters.first) && !hasFolder) {
    print.info(`${context.runtime.brand} generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  let componentPath = hasFolder ? `${options.folder}/${parameters.first || 'index'}` : parameters.first

  let pathComponents = componentPath.split('/').map(pascalCase)
  let name = pathComponents.pop()
  if (name === 'Index') { name = 'index' }
  const relativePath = pathComponents.length ? pathComponents.join('/') + '/' : ''

  const props = { name }
  const jobs = [{
    template: 'component.ejs',
    target: `App/Components/${relativePath}${name}.js`
  }, {
    template: 'component-style.ejs',
    target: `App/Components/${relativePath}Styles/${name}Style.js`
  }, tests === 'ava' && {
    template: 'component-test.ejs',
    target: `Test/Components/${relativePath}${name}Test.js`
  }]

  await ignite.copyBatch(context, jobs, props)
}
