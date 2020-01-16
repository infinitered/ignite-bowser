import { GluegunToolbox } from "gluegun"

export const description = "Generates a component, supporting files, and a storybook test."
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const { parameters, strings, print, ignite, patching, filesystem, prompt } = toolbox
  const { pascalCase, camelCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info('A name is required.')
    print.info(`ignite generate component <name>\n`)
    return
  }

  let componentType
  if (!parameters.options["function-component"] && !parameters.options["stateless-function"]) {
    const componentTypes = [
      {
        name: "functionComponent",
        message: "React.FunctionComponent, aka \"hooks component\"",
      },
      {
        name: "statelessFunction",
        message: "Stateless function, aka the \"classic\" ignite-bowser component",
      },
    ]

    const { component } = await prompt.ask([
      {
        name: "component",
        message: "Which type of component do you want to generate?",
        type: "select",
        choices: componentTypes,
      },
    ])
    componentType = component
  }

  const name = parameters.first
  const pascalName = pascalCase(name)
  const camelCaseName = camelCase(name)
  const props = { name, pascalName, camelCaseName }

  const jobs = [
    {
      template: 'component.story.tsx.ejs',
      target: `app/components/${name}/${name}.story.tsx`
    },
    {
      template: 'styles.ts.ejs',
      target: `app/components/${name}/${name}.styles.ts`
    }
  ]

  if (componentType === "functionComponent" || parameters.options["function-component"]) {
    jobs.push(
      {
        template: 'function-component.tsx.ejs',
        target: `app/components/${name}/${name}.tsx`
      }
    )
  } else if (componentType === "statelessFunction" || parameters.options["stateless-function"]) {
    jobs.push(
      {
        template: 'component.tsx.ejs',
        target: `app/components/${name}/${name}.tsx`
      }
    )
  }

  await ignite.copyBatch(toolbox, jobs, props)

  // patch the barrel export file
  const barrelExportPath = `${process.cwd()}/app/components/index.ts`
  const exportToAdd = `export * from "./${name}/${name}"\n`

  if (!filesystem.exists(barrelExportPath)) {
    const msg =
    `No '${barrelExportPath}' file found. Can't export component.` +
    `Export your new component manually.`
    print.warning(msg)
    process.exit(1)
  }
  await patching.append(barrelExportPath, exportToAdd)

  // wire up example
  await patching.prepend(
    './storybook/storybook-registry.ts',
    `require("../app/components/${name}/${name}.story")\n`
  )
}
