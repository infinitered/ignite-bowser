const execa = require("execa")
const jetpack = require("fs-jetpack")
const tempy = require("tempy")

const IGNITE_COMMAND = "./node_modules/.bin/ignite"
const APP = "IntegrationTest"
const BOILERPLATE = `${__dirname}/../`

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 800000

const execaShell = (command: string, opts = {}) => execa(command, { shell: true, ...opts })

// Run a shell command; if it fails, expect that its output was empty, so that jest
// shows us the error output. Return the result so we can assert further on it.
const expectCommandToSucceed = async (command: string) => {
  const result = await execaShell(command + " 2>&1").catch(error => error)
  if (result.exitCode !== 0) {
    expect(result).toMatchObject({ stdout: "" })
  }
  return result
}

// Do these tests for non-expo and expo apps
const expoFlags = ["--no-expo", "--expo"]
expoFlags.forEach(expoFlag => {
  describe(`a generated ${expoFlag === "--expo" ? "Expo" : "non-Expo"} app`, () => {
    // creates a new temp directory
    const appTemp: string = tempy.directory()
    beforeAll(async () => {
      // make sure we are in the temp directory. Do the initial git commit
      // manually, so we can set up the git user first on circleci.
      process.chdir(appTemp)

      const flags = ["--no-detox", expoFlag, "--skip-git", "--debug", "--overwrite"].join(" ")
      await execaShell(`npx ignite-cli new ${APP} ${flags} --boilerplate ${BOILERPLATE}`)

      process.chdir(APP)

      await execaShell("git init")
      await execaShell('git config user.email "test@example.com"')
      await execaShell("git config user.name test")
      await execaShell("git add -A")
      await execaShell('git commit -m "Initial commit"')
    })

    // clean up generated files between tests; clean up the generated test app when we're done
    afterEach(() => execaShell("git clean -fd; git reset --hard HEAD"))
    afterAll(() => jetpack.remove(appTemp))

    test("passes tests", () => {
      return expectCommandToSucceed("yarn test")
    })

    test("compiles successfully", () => {
      return expectCommandToSucceed("yarn compile")
    })

    test("lints successfully", () => {
      return expectCommandToSucceed("yarn lint --max-warnings 0")
    })

    test("doesn't need reformatting", async () => {
      await expectCommandToSucceed("yarn format")
      // Make sure format didn't change anything
      const { stdout } = await expectCommandToSucceed("git status --porcelain")
      expect(stdout).toEqual("")
    })

    test("generates a stateless function", async () => {
      const statelessFunction = "Stateless"
      await execaShell(`${IGNITE_COMMAND} g component ${statelessFunction} --stateless-function`, {
        preferLocal: false,
      })
      expect(jetpack.exists(`app/components/${statelessFunction}/${statelessFunction}.tsx`)).toBe(
        "file",
      )
      expect(
        jetpack.exists(`app/components/${statelessFunction}/${statelessFunction}.story.tsx`),
      ).toBe("file")
      expect(
        jetpack.exists(`app/components/${statelessFunction}/${statelessFunction}.styles.ts`),
      ).toBe("file")
      await expectCommandToSucceed("yarn lint")
    })

    test("generates a function component", async () => {
      const functionComponent = "FunctionComponent"
      await execaShell(`${IGNITE_COMMAND} g component ${functionComponent} --function-component`, {
        preferLocal: false,
      })
      expect(jetpack.exists(`app/components/${functionComponent}/${functionComponent}.tsx`)).toBe(
        "file",
      )
      expect(
        jetpack.exists(`app/components/${functionComponent}/${functionComponent}.story.tsx`),
      ).toBe("file")
      expect(
        jetpack.exists(`app/components/${functionComponent}/${functionComponent}.styles.ts`),
      ).toBe("file")
      await expectCommandToSucceed("yarn lint")
    })

    test("generates a screen", async () => {
      const simpleScreen = "test"
      await execaShell(`${IGNITE_COMMAND} g screen ${simpleScreen}`, { preferLocal: false })
      expect(jetpack.exists(`app/screens/${simpleScreen}-screen.tsx`)).toBe("file")
      await expectCommandToSucceed("yarn lint")
    })

    test("generates a model", async () => {
      const simpleModel = "test"
      await execaShell(`${IGNITE_COMMAND} g model ${simpleModel}`, { preferLocal: false })
      expect(jetpack.exists(`app/models/${simpleModel}/${simpleModel}.ts`)).toBe("file")
      expect(jetpack.exists(`app/models/${simpleModel}/${simpleModel}.test.ts`)).toBe("file")
      expect(jetpack.exists(`app/models/${simpleModel}/index.ts`)).toBe("file")
      await expectCommandToSucceed("yarn lint")
    })

    test("generates navigation", async () => {
      const simpleNavigation = "test"
      await execaShell(
        `${IGNITE_COMMAND} g navigator test --type Stack --screens DemoScreen,WelcomeScreen --navigators PrimaryNavigator`,
        { preferLocal: false },
      )
      expect(jetpack.exists(`app/navigation/${simpleNavigation}-navigator.ts`)).toBe("file")
      await expectCommandToSucceed("yarn lint")
    })
  })
})
