import * as Font from "expo-font"

export const initFonts = async () => {
  await Promise.all([
    Font.loadAsync({
      "Montserrat": require("./Montserrat-Regular.ttf"),
      "Montserrat-Regular": require("./Montserrat-Regular.ttf"),
    }),
  ])
}
