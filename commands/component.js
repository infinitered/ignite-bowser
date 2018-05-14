// @cliDescription  Generates a component, styles, and an optional test.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, filesystem, patching, prompt } = context
  const { pascalCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  const directoryQuestion = 'Add component to which subdirectory?'
  const directories = filesystem.list('./src/views/').map(directory => `src/views/${directory}`)
  const directoryChoices = ['src/views', ...directories]

  const domainAddAnswer = await prompt.ask({
    name: 'directory',
    type: 'list',
    message: directoryQuestion,
    choices: directoryChoices
  })

  const directoryChoice = domainAddAnswer.directory
  const newDirectory = directoryChoice === directoryChoices[0]
  const sharedComponent = directoryChoice === 'src/views/shared'
  const directoryPath = directoryChoice + '/'
  const name = parameters.first

  const props = { name, pascalName: pascalCase(name), newDirectory, sharedComponent }
  const jobs = [
    {
      template: 'component.tsx.ejs',
      target: `${directoryPath}${name}/${name}.tsx`
    }, {
      template: 'component.presets.ts.ejs',
      target: `${directoryPath}${name}/${name}.presets.ts`
    }, {
      template: 'component.props.ts.ejs',
      target: `${directoryPath}${name}/${name}.props.ts`
    }, {
      template: 'component.story.tsx.ejs',
      target: `${directoryPath}${name}/${name}.story.tsx`
    }, {
      template: 'rollup-index.ts.ejs',
      target: `${directoryPath}${name}/index.ts`
    }
  ]

  await ignite.copyBatch(context, jobs, props)

  // wire up example
  patching.insertInFile('./storybook/storybook-registry.ts', '\n', `require("../${directoryPath}${name}/${name}.story")`)
}
