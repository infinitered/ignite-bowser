const boilerplate = require('../boilerplate')
const plugin = require('../plugin')

test('boilerplate interface', async () => {
  expect(typeof boilerplate.install).toBe('function')
})

test('plugin interface', async () => {
  expect(typeof plugin.add).toBe('function')
  expect(typeof plugin.remove).toBe('function')
})
