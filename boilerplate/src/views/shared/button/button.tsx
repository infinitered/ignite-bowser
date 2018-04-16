import * as React from "react"
import { TouchableOpacity } from "react-native"
import { Text } from "../text"
import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const { preset = "primary", tx, text, style: styleOverride, textStyle: textStyleOverride, children, ...rest } = props

  // assemble the style
  const viewPresetToUse = viewPresets[preset] || viewPresets.primary
  const textPresetToUse = textPresets[preset] || textPresets.primary

  const viewStyle = { ...viewPresetToUse, ...styleOverride }
  const textStyle = { ...textPresetToUse, ...textStyleOverride }

  const content = children || <Text tx={tx} text={text} style={textStyle} />

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {content}
    </TouchableOpacity>
  )
}
