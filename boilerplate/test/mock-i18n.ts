jest.mock("react-native-i18n", () => {
  return {
    // because of the way `react-native-i18n` is built, we need a default export.
    default: {
      /**
       * The translation call will always return this.
       */
      t: key => `${key}.test`,
    },
  }
})
