const constants = {
  PATTERN_IMPORTS: 'imports',
  PATTERN_ROUTES: 'routes'
}

module.exports = {
  constants,
  [constants.PATTERN_IMPORTS]: `import\\s+.+?\\s+from\\s+'react-navigation';?`,
  [constants.PATTERN_ROUTES]: 'const PrimaryNav'
}
