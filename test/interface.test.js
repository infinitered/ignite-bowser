const test = require('ava')
const boilerplate = require('../boilerplate')
const plugin = require('../plugin')

test('boilerplate interface', async t => {
  t.is(typeof boilerplate.install, 'function')
})

test('plugin interface', async t => {
  t.is(typeof plugin.add, 'function')
  t.is(typeof plugin.remove, 'function')
})
