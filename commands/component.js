// @cliDescription  Generates a component, supporting files, and a storybook test.

const domains = require('../lib/domains')

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, patching } = context
  const { pascalCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  const domainPath = await domains.getDomainPath('views', context)

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
