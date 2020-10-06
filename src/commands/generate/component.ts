import { GluegunToolbox } from "gluegun"

export const description = "Generates a component and a storybook test."
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const { parameters, strings, print, ignite, patching, filesystem, prompt } = toolbox
  const { camelCase, isBlank, kebabCase, pascalCase } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info("A name is required.")
    print.info(`ignite generate component <name>\n`)
    return
  }

  let observer = parameters.options.observer
  if (parameters.options.observer === undefined) {
    observer = await prompt.confirm(
      `Should this component be _observed_ by Mobx?\n${print.colors.gray(`

      If you'll be passing any mobx-state-tree objects in this component's props
      and dereferencing them within this component, you'll want the component wrapped
      in \`observer\` so that the component rerenders when properties of the object change.

      If all props will be simple values or objects that don't come from a mobx store,
      you don't need the component to be wrapped in \`observer\`.

      `)}`,
    )
  }

  const name = parameters.first
  const pascalName = pascalCase(name)
  const camelCaseName = camelCase(name)
  const kebabCaseName = kebabCase(name)
  const props = { camelCaseName, kebabCaseName, name, observer, pascalName }

  const jobs = [
    {
      template: "component.story.tsx.ejs",
      target: `app/components/${kebabCaseName}/${kebabCaseName}.story.tsx`,
    },
    {
      template: "component.tsx.ejs",
      target: `app/components/${kebabCaseName}/${kebabCaseName}.tsx`,
    },
  ]

  await ignite.copyBatch(toolbox, jobs, props)

  // patch the barrel export file
  const barrelExportPath = `${process.cwd()}/app/components/index.ts`
  const exportToAdd = `export * from "./${kebabCaseName}/${kebabCaseName}"\n`

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
    "./storybook/storybook-registry.ts",
    `require("../app/components/${kebabCaseName}/${kebabCaseName}.story")\n`,
  )
}
