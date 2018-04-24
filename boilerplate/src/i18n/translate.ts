import I18n from "react-native-i18n"

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function translate(key: string) {
  return key ? I18n.t(key) : null
}

/**
 * Translates with variables.
 *
 * @param key The i18n key
 * @param vars Additional values sure to replace.
 */
export function translateWithVars(key: string, vars: object) {
  return key ? I18n.t(key, vars) : null
}
