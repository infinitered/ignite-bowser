jest.mock("react-native-i18n", () => {
  return {
    t: key => `${key}.test`,
  }
})
