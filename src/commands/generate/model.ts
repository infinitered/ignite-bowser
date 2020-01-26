import { GluegunToolbox } from "gluegun"

export const description = "Generates a model and model test."
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const { parameters, strings, print, ignite, patching, filesystem } = toolbox
  const { camelCase, kebabCase, pascalCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info("A name is required.")
    print.info(`ignite generate model <name>\n`)
    return
  }

  // get permutations of the given model name
  const givenName = parameters.first
  const name = kebabCase(givenName)
  const pascalName = pascalCase(givenName)
  const camelName = camelCase(givenName)

  const props = { name, pascalName }

  const jobs = [
    {
      template: "model.ejs",
      target: `app/models/${name}/${name}.ts`,
    },
    {
      template: "model.test.ejs",
      target: `app/models/${name}/${name}.test.ts`,
    },
  ]

  const rollupPath = `app/models/${name}/index.ts`
  const rollupExists = filesystem.exists(rollupPath)

  if (rollupExists) {
    await patching.prepend(rollupPath, `export * from "./${name}"`)
  } else {
    jobs.push({ template: "rollup-index.ts.ejs", target: rollupPath })
  }

  await ignite.copyBatch(toolbox, jobs, props)

  // include stores in root-store
  if (name.endsWith("-store")) {
    const rootStorePath = "./app/models/root-store/root-store.ts"
    const rootStoreDef = 'export const RootStoreModel = types.model("RootStore").props({'
    const storeTypeImport = `import { ${pascalName}Model } from "../../models/${name}"\n`
    const storeType = `\n  ${camelName}: types.optional(${pascalName}Model, {}),`

    await patching.prepend(rootStorePath, storeTypeImport)
    await patching.patch(rootStorePath, { after: rootStoreDef, insert: storeType })
  }
}
