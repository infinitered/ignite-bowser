const execa = require("execa")
const jetpack = require("fs-jetpack")
const tempy = require("tempy")

const IGNITE_COMMAND = "npx ignite-cli"
const APP = "IntegrationTest"
const BOILERPLATE = `${__dirname}/../`

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 800000

const execaShell = (command: string, opts = {}) => execa(command, { shell: true, ...opts })

describe("a generated app", () => {
  // creates a new temp directory
  const appTemp: string = tempy.directory()
  console.log("Test app directory:", appTemp)

  beforeAll(async () => {
    // make sure we are in the temp directory. Do the initial git commit
    // manually, so we can set up the git user first on circleci.
    process.chdir(appTemp)

    const flags = ["--no-detox", "--no-expo", "--skip-git", "--debug", "--overwrite"].join(" ")
    await execaShell(`${IGNITE_COMMAND} new ${APP} ${flags} --boilerplate ${BOILERPLATE}`)

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
        .then(() => execaShell("git status --porcelain"))
        .catch(error => error),
    ).resolves.toMatchObject({ stdout: "" }) // will fail & show the yarn or test errors
  })

  test("does have a linting script", () => {
    expect(jetpack.read("package.json", "json").scripts.lint).toBe(
      "eslint index.js app storybook test --fix --ext .js,.ts,.tsx",
    )
  })

  test("generates an observed component", async () => {
    const name = "Observed"
    await execaShell(`${IGNITE_COMMAND} g component ${name} --observer`, {
      preferLocal: false,
    })
    expect(jetpack.exists(`app/components/${name}/${name}.tsx`)).toBe("file")
    expect(jetpack.exists(`app/components/${name}/${name}.story.tsx`)).toBe("file")
    const lint = await execa("npm", ["-s", "run", "lint"])
    expect(lint.stderr).toBe("")
  })

  test("generates a plain component", async () => {
    const name = "Unobserved"
    await execaShell(`${IGNITE_COMMAND} g component ${name} --function-component`, {
      preferLocal: false,
    })
    expect(jetpack.exists(`app/components/${name}/${name}.tsx`)).toBe("file")
    expect(jetpack.exists(`app/components/${name}/${name}.story.tsx`)).toBe("file")
    const lint = await execa("npm", ["-s", "run", "lint"])
    expect(lint.stderr).toBe("")
  })

  test("generates a screen", async () => {
    const simpleScreen = "test"
    await execaShell(`${IGNITE_COMMAND} g screen ${simpleScreen}`, { preferLocal: false })
    expect(jetpack.exists(`app/screens/${simpleScreen}-screen/${simpleScreen}-screen.tsx`)).toBe(
      "file",
    )
    const lint = await execa("npm", ["-s", "run", "lint"])
    expect(lint.stderr).toBe("")
  })

  test("generates a model", async () => {
    const simpleModel = "test"
    await execaShell(`${IGNITE_COMMAND} g model ${simpleModel}`, { preferLocal: false })
    expect(jetpack.exists(`app/models/${simpleModel}/${simpleModel}.ts`)).toBe("file")
    expect(jetpack.exists(`app/models/${simpleModel}/${simpleModel}.test.ts`)).toBe("file")
    expect(jetpack.exists(`app/models/index.ts`)).toBe("file")
    const lint = await execa("npm", ["-s", "run", "lint"])
    expect(lint.stderr).toBe("")
  })
})
