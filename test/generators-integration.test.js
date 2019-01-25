const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'
const BOILERPLATE = `${__dirname}/../`
// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 800000

describe('a generated app', () => {
  // creates a new temp directory
  const appTemp = tempy.directory()
  beforeAll(async () => {
    // make sure we are in the temp directory
    process.chdir(appTemp)
    await execa(IGNITE, ['new', APP, '--skip-git', '--boilerplate', BOILERPLATE])
    process.chdir(APP)
  })

  afterAll(() => {
    // clean up generated test app
    jetpack.remove(appTemp)
  })

  test('can lint, compile, and pass tests', async () => {
    return execa.shell("yarn run lint 2>&1")
    .then(() => execa.shell("yarn run compile 2>&1"))
    .then(() => execa.shell("yarn test 2>&1"))
    .catch(error => {
      expect(error.stdout).toEqual('') // will fail & show the errors
    })
  })

  test('does have a linting script', async () => {
    expect(jetpack.read('package.json', 'json')['scripts']['lint']).toBe('npm-run-all lint:*')
  })
})

describe('generators', () => {
  // creates a new temp directory
  const generatorsTemp = tempy.directory()
  beforeAll(async () => {
    // make sure we are in the temp directory
    process.chdir(generatorsTemp)
    await execa(IGNITE, ['new', APP, '--skip-git', '--boilerplate', BOILERPLATE])
    process.chdir(APP)
  })

  afterAll(() => {
    // clean up generated test app
    jetpack.remove(generatorsTemp)
  })

  test('generates a component', async () => {
    const simpleComponent = 'Simple'
    await execa(IGNITE, ['g', 'component', simpleComponent], { preferLocal: false })
    expect(jetpack.exists(`app/components/${simpleComponent}/${simpleComponent}.tsx`)).toBe('file')
    expect(jetpack.exists(`app/components/${simpleComponent}/${simpleComponent}.story.tsx`)).toBe('file')
    expect(jetpack.exists(`app/components/${simpleComponent}/index.ts`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generates a screen', async () => {
    const simpleScreen = 'test'
    await execa(IGNITE, ['g', 'screen', simpleScreen], { preferLocal: false })
    expect(jetpack.exists(`app/screens/${simpleScreen}-screen/${simpleScreen}-screen.tsx`)).toBe('file')
    expect(jetpack.exists(`app/screens/${simpleScreen}-screen/index.ts`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generates a model', async () => {
    const simpleModel = 'test'
    await execa(IGNITE, ['g', 'model', simpleModel], { preferLocal: false })
    expect(jetpack.exists(`app/models/${simpleModel}/${simpleModel}.ts`)).toBe('file')
    expect(jetpack.exists(`app/models/${simpleModel}/${simpleModel}.test.ts`)).toBe('file')
    expect(jetpack.exists(`app/models/${simpleModel}/index.ts`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })
})
