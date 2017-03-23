const test = require('ava')
const execa = require('execa')
const jetpack = require('fs-jetpack')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'

test.before(async t => {
  jetpack.remove(APP)
  await execa(IGNITE, ['new', APP, '--min', '--skip-git', '--boilerplate', `${__dirname}/..`])
  process.chdir(APP)
})

test('generates a component', async t => {
  await execa(IGNITE, ['g', 'component', 'Test'], { preferLocal: false })
  t.is(jetpack.exists('App/Components/Test.js'), 'file')
  t.is(jetpack.exists('App/Components/Styles/TestStyle.js'), 'file')
  const lint = await execa('npm', ['-s', 'run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate listview of type row works', async t => {
  await execa(IGNITE, ['g', 'listview', 'TestRow', '--type=Row'], { preferLocal: false })
  t.is(jetpack.exists('App/Containers/TestRow.js'), 'file')
  t.is(jetpack.exists('App/Containers/Styles/TestRowStyle.js'), 'file')
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate listview of type sections works', async t => {
  await execa(IGNITE, ['g', 'listview', 'TestSection', '--type=WithSections'], { preferLocal: false })
  t.is(jetpack.exists('App/Containers/TestSection.js'), 'file')
  t.is(jetpack.exists('App/Containers/Styles/TestSectionStyle.js'), 'file')
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate listview of type grid works', async t => {
  await execa(IGNITE, ['g', 'listview', 'TestGrid', '--type=Grid'], { preferLocal: false })
  t.is(jetpack.exists('App/Containers/TestGrid.js'), 'file')
  t.is(jetpack.exists('App/Containers/Styles/TestGridStyle.js'), 'file')
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate redux works', async t => {
  await execa(IGNITE, ['g', 'redux', 'Test'], { preferLocal: false })
  t.is(jetpack.exists('App/Redux/TestRedux.js'), 'file')
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate container works', async t => {
  await execa(IGNITE, ['g', 'container', 'Container'], { preferLocal: false })
  t.is(jetpack.exists('App/Containers/Container.js'), 'file')
  t.is(jetpack.exists('App/Containers/Styles/ContainerStyle.js'), 'file')
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate saga works', async t => {
  await execa(IGNITE, ['g', 'saga', 'Test'], { preferLocal: false })
  t.is(jetpack.exists('App/Sagas/TestSagas.js'), 'file')
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate screen works', async t => {
  await execa(IGNITE, ['g', 'screen', 'Test'], { preferLocal: false })
  t.is(jetpack.exists('App/Containers/TestScreen.js'), 'file')
  t.is(jetpack.exists('App/Containers/Styles/TestScreenStyle.js'), 'file')
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test.after.always('clean up all generated items', t => {
  process.chdir('../')
  jetpack.remove(APP)
})
