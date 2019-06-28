import * as RNLocalize from "react-native-localize"
import i18n from "i18n-js"

const en = require("./en")
const ja = require("./ja")

i18n.fallbacks = true
i18n.translations = { en, ja }

const fallback = { languageTag: "en", isRTL: false }
const { languageTag } =
  RNLocalize.findBestAvailableLanguage(Object.keys(i18n.translations)) || fallback
i18n.locale = languageTag
