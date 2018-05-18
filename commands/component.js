// @cliDescription  Generates a component, supporting files, and a storybook test.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, filesystem, patching, prompt } = context
  const { pascalCase, isBlank } = strings
  const options = parameters.options || {}
  const folder = options.folder || options.f

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  const domains = filesystem.list('./src/views/')
  const domainChoices = ['(Create New)', ...domains]
  let domainAddAnswer = {}
  let domainPath = ''
  if (!folder) {
    const domainQuestion = 'Add component to which domain?'
    domainAddAnswer = await prompt.ask({
      name: 'domain',
      type: 'list',
      message: domainQuestion,
      choices: domainChoices
    })
    domainPath = (domainAddAnswer.domain === domainChoices[0]) ? '' : domainAddAnswer.domain + '/'
  } else {
    domainPath = (folder === 'views') ? '' : folder + '/'
  }

  const name = parameters.first
  const pascalName = pascalCase(name)
  const newDomain = isBlank(domainPath)
  const sharedComponent = domainPath === 'shared/'

  const props = { name, pascalName, newDomain, sharedComponent }
  const jobs = [
    {
      template: 'component.tsx.ejs',
      target: `src/views/${domainPath}${name}/${name}.tsx`
    }, {
      template: 'component.presets.ts.ejs',
      target: `src/views/${domainPath}${name}/${name}.presets.ts`
    }, {
      template: 'component.props.ts.ejs',
      target: `src/views/${domainPath}${name}/${name}.props.ts`
    }, {
      template: 'component.story.tsx.ejs',
      target: `src/views/${domainPath}${name}/${name}.story.tsx`
    }, {
      template: 'rollup-index.ts.ejs',
      target: `src/views/${domainPath}${name}/index.ts`
    }
  ]

  await ignite.copyBatch(context, jobs, props)

  // wire up example
  patching.insertInFile('./storybook/storybook-registry.ts', '\n', `require("../src/views/${domainPath}${name}/${name}.story")`)
}
