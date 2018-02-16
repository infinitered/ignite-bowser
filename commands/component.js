// @cliDescription  Generates a component, styles, and an optional test.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, filesystem, patching } = context
  const { pascalCase, isBlank } = strings

  const options = parameters.options || {}

  const hasFolder = !isBlank(options.folder)

  // validation
  if (isBlank(parameters.first) && !hasFolder) {
    print.info(`${context.runtime.brand} generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  const domainQuestion = 'Add component to which domain?'
  const domains = filesystem.list('./src/views/')
  const domainChoices = ['(Create New)', ...domains]

  const domainAddAnswer = await context.prompt.ask({
    name: 'type',
    type: 'list',
    message: domainQuestion,
    choices: domainChoices
  })

  const domainPath = domainAddAnswer.type
  const name = parameters.first

  const props = { name, pascalName: pascalCase(name) }
  const jobs = [
    {
      template: 'component.tsx.ejs',
      target: `src/views/${domainPath}/${name}/${name}.tsx`
    }, {
      template: 'component.presets.ts.ejs',
      target: `src/views/${domainPath}/${name}/${name}.presets.ts`
    }, {
      template: 'component.props.ts.ejs',
      target: `src/views/${domainPath}/${name}/${name}.props.ts`
    }, {
      template: 'component.story.tsx.ejs',
      target: `src/views/${domainPath}/${name}/${name}.story.tsx`
    }, {
      template: 'rollup-index.ts.ejs',
      target: `src/views/${domainPath}/${name}/index.ts`
    }
  ]

  await ignite.copyBatch(context, jobs, props)

  // wire up example
  patching.insertInFile('./storybook/storybook-registry.ts', '\n', `require("../src/views/${domainPath}/${name}/${name}.story")`)
}
