import { GluegunToolbox } from "gluegun"

export const description = "Generates a React Navigation navigator."
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const { print } = toolbox
  print.warning("As of version 5, we no longer support navigator generators.")
}
