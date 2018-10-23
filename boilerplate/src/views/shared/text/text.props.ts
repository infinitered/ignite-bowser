import { TextStyle, TextProps as TextProperties } from "react-native"
import { TextPresets } from "./text.presets"

export interface TextProps extends TextProperties {
  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: TextStyle | TextStyle[]

  /**
   * One of the different types of text presets.
   */
  preset?: TextPresets
}
