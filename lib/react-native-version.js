const { pathOr, is } = require('ramda')

// the default React Native version for this boilerplate
const REACT_NATIVE_VERSION = '0.42.0'

/**
 * Gets the React Native version to use.
 *
 * Attempts to read it from the command line, and if not there, falls back
 * to the version we want for this boilerplate.  For example:
 *
 *   $ ignite new Custom --react-native-version 0.44.1
 *
 * @param {*} context - The gluegun context.
 */
const getReactNativeVersion = (context = {}) => {
  // grab the user's choice (if any)
  const value = pathOr(
    REACT_NATIVE_VERSION,
    ['parameters', 'options', 'react-native-version']
  )(context)

  // --react-native-version must be passed a string
  if (!is(String, value)) {
    return REACT_NATIVE_VERSION
  }

  return value
}

module.exports = {
  REACT_NATIVE_VERSION,
  getReactNativeVersion
}
