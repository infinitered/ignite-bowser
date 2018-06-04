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

  const domains = filesystem.list('./src/models/') || []
  const domainChoices = ['(Create New)', ...domains]
  let domainAddAnswer = {}
  let domainPath = ''
  if (!folder) {
    const domainQuestion = 'Add model to which domain?'
    domainAddAnswer = await prompt.ask({
      name: 'domain',
      type: 'list',
      message: domainQuestion,
      choices: domainChoices
    })
    domainPath = (domainAddAnswer.domain === domainChoices[0]) ? '' : domainAddAnswer.domain + '/'
  } else {
    domainPath = (folder === 'models') ? '' : folder + '/'
  }

  const givenName = parameters.first
  const name = kebabCase(givenName)
  const pascalName = pascalCase(givenName)
  // const newDomain = isBlank(domainPath)

  const props = { name, pascalName }
  const jobs = [
    {
      template: 'model.ejs',
      target: `src/models/${domainPath}${name}/${name}.ts`
    }, {
      template: 'model.test.ejs',
      target: `src/models/${domainPath}${name}/${name}.test.ts`
    }, {
      template: 'rollup-index.ts.ejs',
      target: `src/models/${domainPath}${name}/index.ts`
    }
  ]

  await ignite.copyBatch(context, jobs, props)
}