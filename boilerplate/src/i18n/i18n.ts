import RNLanguages from "react-native-languages"
import i18n from "i18n-js"

const en = require("./en")
const ja = require("./ja")

i18n.locale = RNLanguages.language
i18n.fallbacks = true
i18n.translations = { en, ja }
