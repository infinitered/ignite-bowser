const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'
const BOILERPLATE = `${__dirname}/../`
// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

describe('with a linter', () => {
  beforeAll(async () => {
    // creates a new temp directory
    process.chdir(tempy.directory())
    await execa(IGNITE, ['new', APP, '--skip-git', '--boilerplate', BOILERPLATE])
    process.chdir(APP)
  })

  test('does have a linting script', async () => {
    expect(jetpack.read('package.json', 'json')['scripts']['lint']).toBe('npm-run-all lint:*')
  })
})

describe('generators', () => {
  beforeAll(async () => {
    // creates a new temp directory
    process.chdir(tempy.directory())
    await execa(IGNITE, ['new', APP, '--skip-git', '--boilerplate', BOILERPLATE, '--debug'])
    process.chdir(APP)
  })

  test('generates a component', async () => {
    const simpleComponent = 'Simple'
    await execa(IGNITE, ['g', 'component', simpleComponent], { preferLocal: false })
    expect(jetpack.exists(`src/views/${simpleComponent}/${simpleComponent}.tsx`)).toBe('file')
    expect(jetpack.exists(`src/views/${simpleComponent}/${simpleComponent}.presets.ts`)).toBe('file')
    expect(jetpack.exists(`src/views/${simpleComponent}/${simpleComponent}.props.ts`)).toBe('file')
    expect(jetpack.exists(`src/views/${simpleComponent}/${simpleComponent}.story.tsx`)).toBe('file')
    expect(jetpack.exists(`src/views/${simpleComponent}/index.ts`)).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  // test('generates a folder component', async () => {
  //   const folderComponent = 'Folder'
  //   await execa(IGNITE, ['g', 'component', '--folder', folderComponent], { preferLocal: false })
  //   expect(jetpack.exists(`src/app/${folderComponent}/index.js`)).toBe('file')
  //   // expect(jetpack.exists(`src/app/${folderComponent}/indexStyle.js`)).toBe('file')
  //   const lint = await execa('npm', ['-s', 'run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generates a component inside a folder', async () => {
  //   const componentName = 'InFolder'
  //   const folderName = 'Folder'
  //   await execa(IGNITE, ['g', 'component', '--folder', folderName, componentName], { preferLocal: false })
  //   expect(jetpack.exists(`src/views/${folderName}/${componentName}.js`)).toBe('file')
  //   expect(jetpack.exists(`src/views/${folderName}/${componentName}Style.js`)).toBe('file')
  //   const lint = await execa('npm', ['-s', 'run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generates a component in a relative path', async() => {
  //   await execa(IGNITE, ['g', 'component', 'My/SubFolder/Test'], { preferLocal: false })
  //   expect(jetpack.exists('src/views/My/SubFolder/Test.js')).toBe('file')
  //   expect(jetpack.exists('src/views/My/SubFolder/TestStyle.js')).toBe('file')
  //   const lint = await execa('npm', ['-s', 'run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generate listview of type row works', async () => {
  //   await execa(IGNITE, ['g', 'list', 'TestRow', '--type=Row', '--codeType=listview', '--dataType=Single'], { preferLocal: false })
  //   expect(jetpack.exists('App/Containers/TestRow.js')).toBe('file')
  //   expect(jetpack.exists('App/Containers/TestRowStyle.js')).toBe('file')
  //   const lint = await execa('npm', ['run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generate flatlist of type row works', async () => {
  //   await execa(IGNITE, ['g', 'list', 'TestFlatRow', '--type=Row', '--codeType=flatlist', '--dataType=Single'], { preferLocal: false })
  //   expect(jetpack.exists('App/Containers/TestFlatRow.js')).toBe('file')
  //   expect(jetpack.exists('App/Containers/TestFlatRowStyle.js')).toBe('file')
  //   const lint = await execa('npm', ['run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generate listview of sections works', async () => {
  //   await execa(IGNITE, ['g', 'list', 'TestSection', '--type=Row', '--codeType=listview', '--dataType=Sectioned'], { preferLocal: false })
  //   expect(jetpack.exists('App/Containers/TestSection.js')).toBe('file')
  //   expect(jetpack.exists('App/Containers/TestSectionStyle.js')).toBe('file')
  //   const lint = await execa('npm', ['run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generate flatlist of sections works', async () => {
  //   await execa(IGNITE, ['g', 'list', 'TestFlatSection', '--type=Row', '--codeType=flatlist', '--dataType=Sectioned'], { preferLocal: false })
  //   expect(jetpack.exists('App/Containers/TestFlatSection.js')).toBe('file')
  //   expect(jetpack.exists('App/Containers/TestFlatSectionStyle.js')).toBe('file')
  //   const lint = await execa('npm', ['run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generate listview of type grid works', async () => {
  //   await execa(IGNITE, ['g', 'list', 'TestGrid', '--type=Grid', '--codeType=listview', '--dataType=Single'], { preferLocal: false })
  //   expect(jetpack.exists('App/Containers/TestGrid.js')).toBe('file')
  //   expect(jetpack.exists('App/Containers/TestGridStyle.js')).toBe('file')
  //   const lint = await execa('npm', ['run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generate redux works', async () => {
  //   await execa(IGNITE, ['g', 'redux', 'Test'], { preferLocal: false })
  //   expect(jetpack.exists('App/Redux/TestRedux.js')).toBe('file')
  //   const lint = await execa('npm', ['run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generate container works', async () => {
  //   await execa(IGNITE, ['g', 'container', 'Container'], { preferLocal: false })
  //   expect(jetpack.exists('App/Containers/Container.js')).toBe('file')
  //   expect(jetpack.exists('App/Containers/ContainerStyle.js')).toBe('file')
  //   const lint = await execa('npm', ['run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generate saga works', async () => {
  //   await execa(IGNITE, ['g', 'saga', 'Test'], { preferLocal: false })
  //   expect(jetpack.exists('App/Sagas/TestSagas.js')).toBe('file')
  //   const lint = await execa('npm', ['run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })

  // test('generate screen works', async () => {
  //   await execa(IGNITE, ['g', 'screen', 'Test'], { preferLocal: false })
  //   expect(jetpack.exists('App/Containers/TestScreen.js')).toBe('file')
  //   expect(jetpack.exists('App/Containers/TestScreenStyle.js')).toBe('file')
  //   const lint = await execa('npm', ['run', 'lint'])
  //   expect(lint.stderr).toBe('')
  // })
})
