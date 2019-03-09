module.exports = {
  description: 'Generates a component, supporting files, and a storybook test.',
  run: async function(toolbox) {
    // grab some features
    const { parameters, strings, print, ignite, patching } = toolbox
    const { pascalCase, isBlank } = strings

    // validation
    if (isBlank(parameters.first)) {
      print.info(`${toolbox.runtime.brand} generate component <name>\n`)
      print.info('A name is required.')
      return
    }

    const name = parameters.first
    const pascalName = pascalCase(name)

    const props = { name, pascalName }
    const jobs = [
      {
        template: 'component.tsx.ejs',
        target: `app/components/${name}/${name}.tsx`
      },
      {
        template: 'component.story.tsx.ejs',
        target: `app/components/${name}/${name}.story.tsx`
      },
      {
        template: 'rollup-index.ts.ejs',
        target: `app/components/${name}/index.ts`
      }
    ]

    await ignite.copyBatch(toolbox, jobs, props)

    // wire up example
    patching.insertInFile(
      './storybook/storybook-registry.ts',
      '\n',
      `require("../app/components/${name}/${name}.story")`
    )
  }
}
