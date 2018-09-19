// @cliDescription  Generates a model and model test.

const domains = require('../lib/domains')

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, patching, filesystem } = context
  const { camelCase, kebabCase, pascalCase, isBlank } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate model <name>\n`)
    print.info('A name is required.')
    return
  }

  const givenName = parameters.first
  const name = kebabCase(givenName)
  const pascalName = pascalCase(givenName)
  const camelName = camelCase(givenName)

  const domainPath = await domains.getDomainPath('models', context)

  const newDomain = isBlank(domainPath)
  const props = { name, pascalName, newDomain }

  const jobs = [
    {
      template: 'model.ejs',
      target: `src/models/${domainPath}${name}/${name}.ts`
    }, {
      template: 'model.test.ejs',
      target: `src/models/${domainPath}${name}/${name}.test.ts`
    }
  ]

  const rollupPath = `src/models/${domainPath}${name}/index.ts`
  const rollupExists = filesystem.exists(rollupPath)

  if (rollupExists) {
    patching.insertInFile(rollupPath, 'export', `export * from "./${name}"`, false)
  } else {
    jobs.push({ template: 'rollup-index.ts.ejs', target: rollupPath })
  }

  await ignite.copyBatch(context, jobs, props)

  // include stores in root-store
  if (name.endsWith('store')) {
    const rootStorePath = './src/app/root-store.ts'
    const rootStoreDef = 'export const RootStoreModel'
    const storeTypeImport = `import { ${pascalName}Model } from "../models/${name}"`
    const storeType = `  ${camelName}: types.optional(${pascalName}Model, {}),`

    patching.insertInFile(rootStorePath, 'import', storeTypeImport)
    patching.insertInFile(rootStorePath, rootStoreDef, storeType)
  }
}
