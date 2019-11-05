/**
 * Looking for the boilerplate code?
 *
 * Check in ./src/boilerplate.ts. That file is then compiled from
 * TypeScript into ./build/boilerplate.js, and this file requires
 * that compiled file.
 */

const BOILERPLATE_FILE = `${__dirname}/build/boilerplate.js`
if (!require("fs").existsSync(BOILERPLATE_FILE)) {
  console.error(`\n\nCouldn't find boilerplate.js at`)
  console.error(BOILERPLATE_FILE)
  console.error(`\nIt looks like the boilerplate wasn't compiled with 'yarn build'.\n\n`)
  process.exit(1)
}

module.exports = require(BOILERPLATE_FILE)
