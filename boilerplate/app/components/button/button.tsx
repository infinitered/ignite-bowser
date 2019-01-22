import * as React from "react"
import { TouchableOpacity } from "react-native"
import { Text } from "../text"
import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"
import { reduce } from "ramda"

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

  let viewStyle
  if (Array.isArray(styleOverride)) {
    viewStyle = reduce((acc,term) => {
      return { ...acc, ...term }
    }, viewPresetToUse, styleOverride)
  } else {
    viewStyle = { ...viewPresetToUse, ...styleOverride }
  }

  let textStyle
  if (Array.isArray(textStyleOverride)) {
    textStyle = reduce((acc,term) => {
      return { ...acc, ...term }
    }, textPresetToUse, textStyleOverride)
  } else {
    textStyle = { ...textPresetToUse, ...textStyleOverride }
  }

  const content = children || <Text tx={tx} text={text} style={textStyle} />

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {content}
    </TouchableOpacity>
  )
}
