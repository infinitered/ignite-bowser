const en = require("../app/i18n/en.json")
const { exec } = require("child_process")

// Use this array for keys that for whatever reason aren't greppable so they
// don't hold your test suite hostage by always failing.
const EXCEPTIONS = [
  // "welcomeScreen.readyForLaunch",
]

/**
 * This tests your codebase for missing i18n strings so you can avoid error strings at render time
 *
 * It was taken from https://gist.github.com/Michaelvilleneuve/8808ba2775536665d95b7577c9d8d5a1
 * and modified slightly to account for our Bowser higher order components,
 * which take 'tx' and 'fooTx' props.
 * The grep command is nasty looking, but it's essentially searching the codebase for 3 things:
 *
 * tx="*"
 * Tx=""
 * translate(""
 *
 * and then grabs the i18n key between the double quotes
 *
 * This approach isn't 100% perfect. If you are storing your key string in a variable because you
 * are setting it conditionally, then it won't be picked up.
 *
 */

describe("i18n", () => {
  test("There are no missing keys", done => {
    // Actual command output:
    // grep "Tx=\"\S*\"\|tx=\"\S*\"\|translate(\"\S*\"" -ohr './app' | grep -o "\".*\""
    const command = `grep "Tx=\\"\\S*\\"\\|tx=\\"\\S*\\"\\|translate(\\"\\S*\\"" -ohr '../app' | grep -o "\\".*\\""`
    exec(command, (_, stdout) => {
      const allTranslationsDefined = iterate(en, "", [])
      const allTranslationsUsed = stdout.replace(new RegExp('"', "g"), "").split("\n")
      allTranslationsUsed.splice(-1, 1)

      for (let i = 0; i < allTranslationsUsed.length; i += 1) {
        if (!EXCEPTIONS.includes(allTranslationsUsed[i])) {
          // You can add keys to EXCEPTIONS (above) if you don't want them included in the test
          expect(allTranslationsDefined).toContainEqual(allTranslationsUsed[i])
        }
      }
      done()
    })
  }, 240000)
})

function iterate(obj, stack, array) {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === "object") {
        iterate(obj[property], `${stack}.${property}`, array)
      } else {
        array.push(`${stack.slice(1)}.${property}`)
      }
    }
  }

  return array
}
