const test = require('ava')
const execa = require('execa')
const jetpack = require('fs-jetpack')
const path = require('path')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'

test.before(async t => {
  jetpack.remove(APP)
  await execa(IGNITE, ['new', APP, '--min', '--skip-git', `--boilerplate=${__dirname}/../`], { env: { 'IGNITE_PLUGIN_PATH': path.resolve('../') } })
  process.chdir(APP)
  // for some  reason... add it again (TODO: WTF)
  await execa(IGNITE, ['add', '../'])
})

test('generates a component', async t => {
  await execa(IGNITE, ['g', 'component', 'Test'])
  t.truthy(jetpack.exists('App/Components/Test.js'))
  t.truthy(jetpack.exists('App/Components/Styles/TestStyle.js'))
  const lint = await execa('npm', ['-s', 'run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate listview of type row works', async t => {
  await execa(IGNITE, ['g', 'listview', 'TestRow', '--type=Row'])
  t.truthy(jetpack.exists('App/Containers/TestRow.js'))
  t.truthy(jetpack.exists('App/Containers/Styles/TestRowStyle.js'))
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate listview of type sections works', async t => {
  await execa(IGNITE, ['g', 'listview', 'TestSection', '--type=WithSections'])
  t.truthy(jetpack.exists('App/Containers/TestSection.js'))
  t.truthy(jetpack.exists('App/Containers/Styles/TestSectionStyle.js'))
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate listview of type grid works', async t => {
  await execa(IGNITE, ['g', 'listview', 'TestGrid', '--type=Grid'])
  t.truthy(jetpack.exists('App/Containers/TestGrid.js'))
  t.truthy(jetpack.exists('App/Containers/Styles/TestGridStyle.js'))
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate redux works', async t => {
  await execa(IGNITE, ['g', 'redux', 'Test'])
  t.truthy(jetpack.exists('App/Redux/TestRedux.js'))
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate container works', async t => {
  await execa(IGNITE, ['g', 'container', 'Container'])
  t.truthy(jetpack.exists('App/Containers/Container.js'))
  t.truthy(jetpack.exists('App/Containers/Styles/ContainerStyle.js'))
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate saga works', async t => {
  await execa(IGNITE, ['g', 'saga', 'Test'])
  t.truthy(jetpack.exists('App/Sagas/TestSagas.js'))
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test('generate screen works', async t => {
  await execa(IGNITE, ['g', 'screen', 'Test'])
  t.truthy(jetpack.exists('App/Containers/TestScreen.js'))
  t.truthy(jetpack.exists('App/Containers/Styles/TestScreenStyle.js'))
  const lint = await execa('npm', ['run', 'lint'])
  t.is(lint.stderr, '')
})

test.after.always('clean up all generated items', t => {
  process.chdir('../')
  jetpack.remove(APP)
})
