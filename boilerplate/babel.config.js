module.exports = {
  presets: ["module:metro-react-native-babel-preset", "module:react-native-dotenv"],
  env: {
    production: {},
  },
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
    ["@babel/plugin-proposal-optional-catch-binding"],
  ],
}
