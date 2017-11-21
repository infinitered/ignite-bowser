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
    const simpleComponent = 'Simple'
    await execa(IGNITE, ['g', 'component', simpleComponent], { preferLocal: false })
    expect(jetpack.exists(`App/Components/${simpleComponent}.js`)).toBe('file')
    expect(jetpack.exists(`App/Components/Styles/${simpleComponent}Style.js`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generates a folder component', async () => {
    const folderComponent = 'Folder'
    await execa(IGNITE, ['g', 'component', '--folder', folderComponent], { preferLocal: false })
    expect(jetpack.exists(`App/Components/${folderComponent}/index.js`)).toBe('file')
    expect(jetpack.exists(`App/Components/${folderComponent}/Styles/indexStyle.js`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generates a component inside a folder', async () => {
    const componentName = 'InFolder'
    const folderName = 'Folder'
    await execa(IGNITE, ['g', 'component', '--folder', folderName, componentName], { preferLocal: false })
    expect(jetpack.exists(`App/Components/${folderName}/${componentName}.js`)).toBe('file')
    expect(jetpack.exists(`App/Components/${folderName}/Styles/${componentName}Style.js`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generates a component in a relative path', async() => {
    await execa(IGNITE, ['g', 'component', 'My/SubFolder/Test'], { preferLocal: false })
    expect(jetpack.exists('App/Components/My/SubFolder/Test.js')).toBe('file')
    expect(jetpack.exists('App/Components/My/SubFolder/Styles/TestStyle.js')).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate listview of type row works', async () => {
    await execa(IGNITE, ['g', 'list', 'TestRow', '--type=Row', '--codeType=listview', '--dataType=Single'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/TestRow.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestRowStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate flatlist of type row works', async () => {
    await execa(IGNITE, ['g', 'list', 'TestFlatRow', '--type=Row', '--codeType=flatlist', '--dataType=Single'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/TestFlatRow.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestFlatRowStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate listview of sections works', async () => {
    await execa(IGNITE, ['g', 'list', 'TestSection', '--type=Row', '--codeType=listview', '--dataType=Sectioned'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/TestSection.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestSectionStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate flatlist of sections works', async () => {
    await execa(IGNITE, ['g', 'list', 'TestFlatSection', '--type=Row', '--codeType=flatlist', '--dataType=Sectioned'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/TestFlatSection.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestFlatSectionStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  test('generate listview of type grid works', async () => {
    await execa(IGNITE, ['g', 'list', 'TestGrid', '--type=Grid', '--codeType=listview', '--dataType=Single'], { preferLocal: false })
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
