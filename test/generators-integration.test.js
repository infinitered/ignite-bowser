const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'
const BOILERPLATE = `${__dirname}/../`
// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 800000

describe('with a linter', () => {
  // creates a new temp directory
  const linterTemp = tempy.directory()
  beforeAll(async () => {
    // make sure we are in the temp directory
    process.chdir(linterTemp)
    await execa(IGNITE, ['new', APP, '--skip-git', '--boilerplate', BOILERPLATE])
    process.chdir(APP)
  })

  afterAll(() => {
    // clean up generated test app
    jetpack.remove(linterTemp)
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
    await execa(IGNITE, ['g', 'component', simpleComponent, '--folder', 'views'], { preferLocal: false })
    expect(jetpack.exists(`src/views/${simpleComponent}/${simpleComponent}.tsx`)).toBe('file')
    expect(jetpack.exists(`src/views/${simpleComponent}/${simpleComponent}.presets.ts`)).toBe('file')
    expect(jetpack.exists(`src/views/${simpleComponent}/${simpleComponent}.props.ts`)).toBe('file')
    expect(jetpack.exists(`src/views/${simpleComponent}/${simpleComponent}.story.tsx`)).toBe('file')
    expect(jetpack.exists(`src/views/${simpleComponent}/index.ts`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generates a component inside a directory', async () => {
    const directoryComponent = 'Directory'
    await execa(IGNITE, ['g', 'component', directoryComponent, '--folder', 'example'], { preferLocal: false })
    expect(jetpack.exists(`src/views/example/${directoryComponent}/${directoryComponent}.tsx`)).toBe('file')
    expect(jetpack.exists(`src/views/example/${directoryComponent}/${directoryComponent}.presets.ts`)).toBe('file')
    expect(jetpack.exists(`src/views/example/${directoryComponent}/${directoryComponent}.props.ts`)).toBe('file')
    expect(jetpack.exists(`src/views/example/${directoryComponent}/${directoryComponent}.story.tsx`)).toBe('file')
    expect(jetpack.exists(`src/views/example/${directoryComponent}/index.ts`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generates a shared component', async () => {
    const sharedComponent = 'Shared'
    await execa(IGNITE, ['g', 'component', sharedComponent, '--folder', 'shared'], { preferLocal: false })
    expect(jetpack.exists(`src/views/shared/${sharedComponent}/${sharedComponent}.tsx`)).toBe('file')
    expect(jetpack.exists(`src/views/shared/${sharedComponent}/${sharedComponent}.presets.ts`)).toBe('file')
    expect(jetpack.exists(`src/views/shared/${sharedComponent}/${sharedComponent}.props.ts`)).toBe('file')
    expect(jetpack.exists(`src/views/shared/${sharedComponent}/${sharedComponent}.story.tsx`)).toBe('file')
    expect(jetpack.exists(`src/views/shared/${sharedComponent}/index.ts`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generates a screen', async () => {
    const simpleScreen = 'test'
    await execa(IGNITE, ['g', 'screen', simpleScreen, '--folder', 'views'], { preferLocal: false })
    expect(jetpack.exists(`src/views/${simpleScreen}/${simpleScreen}-screen.tsx`)).toBe('file')
    expect(jetpack.exists(`src/views/${simpleScreen}/index.ts`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generates a model', async () => {
    const simpleModel = 'test'
    await execa(IGNITE, ['g', 'model', simpleModel, '--folder', 'models'], { preferLocal: false })
    expect(jetpack.exists(`src/models/${simpleModel}/${simpleModel}.ts`)).toBe('file')
    expect(jetpack.exists(`src/models/${simpleModel}/${simpleModel}.test.ts`)).toBe('file')
    expect(jetpack.exists(`src/models/${simpleModel}/index.ts`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })
})
