/**
 *
 * @param {*} baseDir - The directory under `/src` where we should get the domain list
 * @param {*} context - The gluegun context
 */

const getDomainPath = async (baseDir, context) => {
  const { parameters, filesystem, prompt } = context
  const options = parameters.options || {}
  const domains = filesystem.list(`./src/${baseDir}/`) || []
  const domainChoices = ['(Create New)', ...domains]
  const folder = options.folder || options.f

  let domainAddAnswer = {}
  let domainPath = ''
  if (!folder) {
    const domainQuestion = 'Add this to which domain?'
    domainAddAnswer = await prompt.ask({
      name: 'domain',
      type: 'list',
      message: domainQuestion,
      choices: domainChoices
    })
    domainPath =
      domainAddAnswer.domain === domainChoices[0]
        ? ''
        : domainAddAnswer.domain + '/'
  } else {
    domainPath = folder === baseDir ? '' : folder + '/'
  }

  return domainPath
}

module.exports = {
  getDomainPath
}
