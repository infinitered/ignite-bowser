// @cliDescription  Generates a model and model test.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, filesystem, patching, prompt } = context
  const { kebabCase, pascalCase, isBlank } = strings
  const options = parameters.options || {}
  const folder = options.folder || options.f

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate model <name>\n`)
    print.info('A name is required.')
    return
  }

  const givenName = parameters.first
  const name = kebabCase(givenName)
  const pascalName = pascalCase(givenName)

  const props = { name, pascalName }
  const jobs = [
    {
      template: 'model.ejs',
      target: `src/models/${name}/${name}.ts`
    }, {
      template: 'model.test.ejs',
      target: `src/models/${name}/${name}.test.ts`
    }, {
      template: 'rollup-index.ts.ejs',
      target: `src/models/${name}/index.ts`
    }
  ]

  await ignite.copyBatch(context, jobs, props)
}