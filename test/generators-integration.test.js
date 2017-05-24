const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'
const BOILERPLATE = `${__dirname}/..`

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

describe('without a linter', () => {
  beforeAll(async () => {
    // creates a new temp directory
    process.chdir(tempy.directory())
    await execa(IGNITE, ['new', APP, '--min', '--skip-git', '--no-lint', '--boilerplate', BOILERPLATE])
    process.chdir(APP)
  })

  test('does not have a linting script', async () => {
    expect(jetpack.read('package.json', 'json')['scripts']['lint']).toBe(undefined)
  })
})

describe('generators', () => {
  beforeAll(async () => {
    // creates a new temp directory
    process.chdir(tempy.directory())
    await execa(IGNITE, ['new', APP, '--min', '--skip-git', '--boilerplate', BOILERPLATE])
    process.chdir(APP)
  })

  test('generates a component', async () => {
    await execa(IGNITE, ['g', 'component', 'Test'], { preferLocal: false })
    expect(jetpack.exists('App/Components/Test.js')).toBe('file')
    expect(jetpack.exists('App/Components/Styles/TestStyle.js')).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate listview of type row works', async () => {
    await execa(IGNITE, ['g', 'listview', 'TestRow', '--type=Row'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/TestRow.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestRowStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate listview of type sections works', async () => {
    await execa(IGNITE, ['g', 'listview', 'TestSection', '--type=WithSections'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/TestSection.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestSectionStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate listview of type grid works', async () => {
    await execa(IGNITE, ['g', 'listview', 'TestGrid', '--type=Grid'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/TestGrid.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestGridStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate redux works', async () => {
    await execa(IGNITE, ['g', 'redux', 'Test'], { preferLocal: false })
    expect(jetpack.exists('App/Redux/TestRedux.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate container works', async () => {
    await execa(IGNITE, ['g', 'container', 'Container'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/Container.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/ContainerStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate saga works', async () => {
    await execa(IGNITE, ['g', 'saga', 'Test'], { preferLocal: false })
    expect(jetpack.exists('App/Sagas/TestSagas.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate screen works', async () => {
    await execa(IGNITE, ['g', 'screen', 'Test'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/TestScreen.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestScreenStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })
})
