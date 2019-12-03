import { pathOr, is } from "ramda"
import { GluegunRunContext } from "gluegun"

// the default React Native version for this boilerplate
export const REACT_NATIVE_VERSION = "0.61.2"

// where the version lives under gluegun
const pathToVersion = ["parameters", "options", "react-native-version"]

// accepts the context and returns back the version
const getVersionFromContext = pathOr(REACT_NATIVE_VERSION, pathToVersion)

/**
 * Gets the React Native version to use.
 *
 * Attempts to read it from the command line, and if not there, falls back
 * to the version we want for this boilerplate.  For example:
 *
 *   $ ignite new Custom --react-native-version 0.61.2
 *
 * @param {*} context - The gluegun context.
 */
export const getReactNativeVersion = (context?: GluegunRunContext) => {
  const version = getVersionFromContext(context || {})
  return is(String, version) ? version : REACT_NATIVE_VERSION
}
