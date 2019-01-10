import * as React from "react"
import { Text as ReactNativeText } from "react-native"
import { presets } from "./text.presets"
import { TextProps } from "./text.props"
import { translate } from "../../i18n"
import { reduce } from "ramda"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props: TextProps) {
  // grab the props
  const { preset = "default", tx, text, children, style: styleOverride, ...rest } = props

  // figure out which content to use
  const i18nText = tx && translate(tx)
  const content = i18nText || text || children

  // assemble the style
  const presetToUse = presets[preset] || presets.default
  let style
  if (Array.isArray(styleOverride)) {
    style = reduce((acc,term) => {
      return { ...acc, ...term }
    }, presetToUse, styleOverride)
  } else {
    style = { ...presetToUse, ...styleOverride }
  }


  return (
    <ReactNativeText {...rest} style={style}>
      {content}
    </ReactNativeText>
  )
}
