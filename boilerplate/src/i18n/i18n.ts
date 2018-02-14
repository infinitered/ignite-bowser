import I18n from "react-native-i18n"

const en = require("./en")
const ja = require("./ja")

I18n.fallbacks = true
I18n.translations = { en, ja }
