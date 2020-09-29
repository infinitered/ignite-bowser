import { build } from "gluegun"

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  // create a CLI runtime
  const cli = build()
    .brand("ignite-bowser")
    .exclude([
      "meta",
      "strings",
      "print",
      "filesystem",
      "semver",
      "system",
      "prompt",
      "http",
      "template",
      "patching",
    ])
    .src(__dirname)
    .help() // provides default for help, h, --help, -h
    .create()

  return cli.run(argv)
}

module.exports = { run }
