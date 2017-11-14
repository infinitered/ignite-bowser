// @cliDescription  Generates a component, styles, and an optional test.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite } = context
  const { pascalCase, isBlank } = strings
  const config = ignite.loadIgniteConfig()
  const { tests } = config

  const options = parameters.options || {}

  const isFolder = !isBlank(options.folder)

  // validation
  if (isBlank(parameters.first) && !isFolder) {
    print.info(`${context.runtime.brand} generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  const isInFolder = isFolder && parameters.first

  // read some configuration
  const name = pascalCase(parameters.first || options.folder)
  const props = { name }
  const jobs = []

  if (isInFolder) {
    const componentFolderName = options.folder
    jobs.push({
      template: 'component.ejs',
      target: `App/Components/${componentFolderName}/${name}.js`
    })
    jobs.push({
      template: 'component-style.ejs',
      target: `App/Components/${componentFolderName}/Styles/${name}Style.js`
    })
    tests === 'ava' && jobs.push({
      template: 'component-test.ejs',
      target: `Test/Components/${componentFolderName}/${name}Test.js`
    })
  } else if (isFolder) {
    jobs.push({
      template: 'component.ejs',
      target: `App/Components/${name}/index.js`
    })
    jobs.push({
      template: 'component-style.ejs',
      target: `App/Components/${name}/Styles/${name}Style.js`
    })
    tests === 'ava' && jobs.push({
      template: 'component-test.ejs',
      target: `Test/Components/${name}/${name}Test.js`
    })
  } else {
    jobs.push({
      template: 'component.ejs',
      target: `App/Components/${name}.js`
    })
    jobs.push({
      template: 'component-style.ejs',
      target: `App/Components/Styles/${name}Style.js`
    })
    tests === 'ava' && jobs.push({
      template: 'component-test.ejs',
      target: `Test/Components/${name}Test.js`
    })
  }

  await ignite.copyBatch(context, jobs, props)
}
