// @cliDescription  Generates a model and model test.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, filesystem, patching, prompt } = context
  const { camelCase, kebabCase, pascalCase, isBlank } = strings
  const options = parameters.options || {}
  const folder = options.folder || options.f

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
    domainPath = (domainAddAnswer.domain === domainChoices[0]) ? name : domainAddAnswer.domain
  } else {
    domainPath = (folder === 'models') ? '' : folder
  }

  const props = { name, pascalName }
  const jobs = [
    {
      template: 'model.ejs',
      target: `src/models/${domainPath}/${name}.ts`
    }, {
      template: 'model.test.ejs',
      target: `src/models/${domainPath}/${name}.test.ts`
    }
  ]

  const rollupPath = `src/models/${domainPath}/index.ts`
  const newDomain = domainPath === name

  if (newDomain) {
    jobs.push({ template: 'rollup-index.ts.ejs', target: rollupPath })
  } else {
    patching.insertInFile(rollupPath, 'export', `export * from "./${name}"`, false)
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