import { GluegunToolbox } from "gluegun"

export const description = "Generates a React Native screen."
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const { parameters, print, strings, ignite, filesystem, patching } = toolbox
  const { camelCase, isBlank, kebabCase, pascalCase } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info("A name is required.")
    print.info(`ignite generate screen <name>\n`)
    return
  }

  let name = parameters.first
  const matches = name.match(/(.*)((-s|S)creen)$/)
  if (matches) {
    name = matches[1] // grab the name without the suffix
    // prettier-ignore
    print.info(`Note: For future reference, the \`${matches[2]}\` suffix is automatically added for you.`)
    print.info(`You're welcome to add it manually, but we wanted you to know you don't have to. :)`)
  }

  // get permutations of the given name, suffixed
  const pascalName = pascalCase(name) + "Screen"
  const camelName = camelCase(name) + "Screen"
  const kebabName = kebabCase(name) + "-screen"

  const props = { pascalName, camelName }
  const jobs = [
    {
      template: `screen.ejs`,
      target: `app/screens/${kebabName}/${kebabName}.tsx`,
    },
  ]

  // make the templates
  await ignite.copyBatch(toolbox, jobs, props)

  // patch the barrel export file
  const barrelExportPath = `${process.cwd()}/app/screens/index.ts`
  const exportToAdd = `export * from "./${kebabName}/${kebabName}"\n`

  if (!filesystem.exists(barrelExportPath)) {
    const msg =
      `No '${barrelExportPath}' file found. Can't export screen.` +
      `Export your new screen manually.`
    print.warning(msg)
    process.exit(1)
  }
  await patching.append(barrelExportPath, exportToAdd)

  print.info(`Screen ${pascalName} created`)
}
