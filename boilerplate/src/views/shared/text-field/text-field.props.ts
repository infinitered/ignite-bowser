import { TextInputProperties, TextStyle, ViewStyle } from "react-native"

export interface TextFieldProps extends TextInputProperties {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: string

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string

  /**
   * The label i18n key.
   */
  labelTx?: string

  /**
   * The label text if no labelTx is provided.
   */
  label?: string

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: ViewStyle

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: TextStyle

  /**
   * Various look & feels.
   */
  preset?: "default"
}
