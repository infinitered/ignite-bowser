import { load, loadString, save, saveString, clear, remove } from "./storage"

// fixtures
const VALUE_OBJECT = { x: 1 }
const VALUE_STRING = JSON.stringify(VALUE_OBJECT)

// mocks
const mockGetItem = jest.fn().mockReturnValue(Promise.resolve(VALUE_STRING))
const mockSetItem = jest.fn()
const mockRemoveItem = jest.fn()
const mockClear = jest.fn()

// replace AsyncStorage
jest.mock("AsyncStorage", () => ({
  getItem: mockGetItem,
  setItem: mockSetItem,
  removeItem: mockRemoveItem,
  clear: mockClear,
}))

// reset mocks after each test
afterEach(() => jest.clearAllMocks())

test("load", async () => {
  const value = await load("something")
  expect(value).toEqual(JSON.parse(VALUE_STRING))
})

test("loadString", async () => {
  const value = await loadString("something")
  expect(value).toEqual(VALUE_STRING)
})

test("save", async () => {
  await save("something", VALUE_OBJECT)
  expect(mockSetItem).toHaveBeenCalledWith("something", VALUE_STRING)
})

test("saveString", async () => {
  await saveString("something", VALUE_STRING)
  expect(mockSetItem).toHaveBeenCalledWith("something", VALUE_STRING)
})

test("remove", async () => {
  await remove("something")
  expect(mockRemoveItem).toHaveBeenCalledWith("something")
})

test("clear", async () => {
  await clear()
  expect(mockClear).toHaveBeenCalledWith()
})
