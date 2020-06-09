import { Platform } from "react-native"

/*
 * A list of fonts available by default on iOS and Android are available here:
 * https://www.skcript.com/svr/react-native-fonts/
 */

/**
 * Just the font names.
 *
 * The various styles of fonts are defined in the <Text /> component.
 */
export const typography = {
  /**
   * The primary font.  Used in most places.
   */
  primary: Platform.select({ ios: "Montserrat", android: "Montserrat" }),

  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: "Montserrat", android: "Montserrat" }),
}
