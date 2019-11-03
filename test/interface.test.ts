import * as boilerplate from "../boilerplate"
import * as plugin from "../plugin"

test("boilerplate interface", async () => {
  expect(typeof boilerplate.install).toBe("function")
})

test("plugin interface", async () => {
  expect(typeof plugin.add).toBe("function")
  expect(typeof plugin.remove).toBe("function")
})
