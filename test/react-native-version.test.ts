import { getReactNativeVersion as get, REACT_NATIVE_VERSION as DEFAULT } from "../src/lib/react-native-version"

/**
 * Runs with a valid gluegun context and a staged version number.
 *
 * @param {*} reactNativeVersion The React Native version to use.
 * @return {string} The version number we should be using.
 */
const mock = reactNativeVersion =>
  get({
    parameters: {
      options: {
        "react-native-version": reactNativeVersion,
      },
    },
  } as any)

// this would only happen if we screwed something up in our boilerplate.js
test("it handles strange inputs from code", () => {
  expect(get()).toBe(DEFAULT)
  expect(get(null)).toBe(DEFAULT)
})

// this could happen because it's valid input via minimist from the user
test("it handles strange input from the user", () => {
  expect(mock(true)).toBe(DEFAULT)
  expect(mock(false)).toBe(DEFAULT)
  expect(mock([])).toBe(DEFAULT)
  expect(mock({})).toBe(DEFAULT)
})

// very edge-casey
test("it handles not-quite semver numbers", () => {
  expect(mock(0)).toBe(DEFAULT)
  expect(mock(0.25)).toBe(DEFAULT)
})

// happy path
test("it handles valid versions", () => {
  expect(mock("0.41.0")).toBe("0.41.0")
  expect(mock("0.41.0-beta.1")).toBe("0.41.0-beta.1")
  expect(mock(DEFAULT)).toBe(DEFAULT)
  expect(mock("next")).toBe("next")
})
