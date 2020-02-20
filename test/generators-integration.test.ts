const execa = require("execa")
const jetpack = require("fs-jetpack")
const tempy = require("tempy")

const IGNITE = "ignite"
const APP = "IntegrationTest"
const BOILERPLATE = `${__dirname}/../`
// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 800000

const execaShell = (command, opts = {}) => execa(command, { shell: true, ...opts })

describe("a generated app", () => {
  // creates a new temp directory
  const appTemp = tempy.directory()
  beforeAll(async () => {
    // make sure we are in the temp directory. Do the initial git commit
    // manually, so we can set up the git user first on circleci.
    process.chdir(appTemp)
    await execa(IGNITE, [
      "new",
      APP,
      "--no-detox",
      "--skip-git",
      "--debug",
      "--overwrite",
      "--boilerplate",
      BOILERPLATE,
    ])
    process.chdir(APP)
    await execaShell("git init")
    await execaShell('git config user.email "test@example.com"')
    await execaShell("git config user.name test")
    await execaShell("git add -A")
    await execaShell('git commit -m "Initial commit"')
  })

  afterAll(() => {
    // clean up generated test app
    jetpack.remove(appTemp)
  })

  test("can yarn install and pass tests", () => {
    return expect(
      execaShell("yarn test 2>&1")
        .then(() => execaShell("git status --porcelain"))
        .then(({ stdout }) => expect(stdout).toEqual(""))
        .then(() =>
          execaShell("yarn compile 2>&1 && yarn format 2>&1 && yarn lint --max-warnings 0 2>&1"),
        )
        .then(() => execaShell("git status --porcelain")),
    ).resolves.toMatchObject({ stdout: "" }) // will fail & show the yarn or test errors
  })

  test("does have a linting script", () => {
    expect(jetpack.read("package.json", "json").scripts.lint).toBe(
      "eslint index.js app --fix --ext .js,.ts,.tsx",
    )
  })

  test("generates a stateless function", async () => {
    const statelessFunction = "Stateless"
    await execa(IGNITE, ["g", "component", statelessFunction, "--stateless-function"], { preferLocal: false })
    expect(jetpack.exists(`app/components/${statelessFunction}/${statelessFunction}.tsx`)).toBe("file")
    expect(jetpack.exists(`app/components/${statelessFunction}/${statelessFunction}.story.tsx`)).toBe("file")
    expect(jetpack.exists(`app/components/${statelessFunction}/${statelessFunction}.styles.ts`)).toBe("file")
    const lint = await execa("npm", ["-s", "run", "lint"])
    expect(lint.stderr).toBe("")
  })

  test("generates a function component", async () => {
    const functionComponent = "FunctionComponent"
    await execa(IGNITE, ["g", "component", functionComponent, "--function-component"], { preferLocal: false })
    expect(jetpack.exists(`app/components/${functionComponent}/${functionComponent}.tsx`)).toBe("file")
    expect(jetpack.exists(`app/components/${functionComponent}/${functionComponent}.story.tsx`)).toBe("file")
    expect(jetpack.exists(`app/components/${functionComponent}/${functionComponent}.styles.ts`)).toBe("file")
    const lint = await execa("npm", ["-s", "run", "lint"])
    expect(lint.stderr).toBe("")
  })

  test("generates a screen", async () => {
    const simpleScreen = "test"
    await execa(IGNITE, ["g", "screen", simpleScreen], { preferLocal: false })
    expect(jetpack.exists(`app/screens/${simpleScreen}-screen/${simpleScreen}-screen.tsx`)).toBe("file")
    const lint = await execa("npm", ["-s", "run", "lint"])
    expect(lint.stderr).toBe("")
  })

  test("generates a model", async () => {
    const simpleModel = "test"
    await execa(IGNITE, ["g", "model", simpleModel], { preferLocal: false })
    expect(jetpack.exists(`app/models/${simpleModel}/${simpleModel}.ts`)).toBe("file")
    expect(jetpack.exists(`app/models/${simpleModel}/${simpleModel}.test.ts`)).toBe("file")
    expect(jetpack.exists(`app/models/${simpleModel}/index.ts`)).toBe("file")
    const lint = await execa("npm", ["-s", "run", "lint"])
    expect(lint.stderr).toBe("")
  })

  test("generates navigation", async () => {
    const simpleNavigation = "test"
    await execa(
      IGNITE,
      [
        "g",
        "navigator",
        "test",
        "--type",
        "Stack",
        "--screens",
        "DemoScreen,WelcomeScreen",
        "--navigators",
        "PrimaryNavigator",
      ],
      { preferLocal: false },
    )
    expect(jetpack.exists(`app/navigation/${simpleNavigation}-navigator.ts`)).toBe("file")
    const lint = await execa("npm", ["-s", "run", "lint"])
    expect(lint.stderr).toBe("")
  })
})
