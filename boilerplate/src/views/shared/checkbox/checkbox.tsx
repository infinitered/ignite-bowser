import * as React from "react"
import { TouchableOpacity, TextStyle, ViewStyle, View } from "react-native"
import { Text } from "../text"
import { color, spacing } from "../../../theme"
import { CheckboxProps } from "./checkbox.props"
import { concat, mergeWith } from "ramda"

const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingVertical: spacing[1],
  alignSelf: "flex-start",
}

const DIMENSIONS = { width: 16, height: 16 }

const OUTLINE: ViewStyle = {
  ...DIMENSIONS,
  marginTop: 2, // finicky and will depend on font/line-height/baseline/weather
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,//
  borderColor: color.primaryDarker,
  borderRadius: 1,
}

const FILL: ViewStyle = {
  width: DIMENSIONS.width - 4,
  height: DIMENSIONS.height - 4,
  backgroundColor: color.primary,
}

const LABEL: TextStyle = { paddingLeft: spacing[2] }

export function Checkbox(props: CheckboxProps) {
  const numberOfLines = props.multiline ? 0 : 1

  let rootStyle
  if (Array.isArray(props.style)) {
    rootStyle = mergeWith(concat, ROOT, props.style) as ViewStyle
  } else {
    rootStyle = { ...ROOT, ...props.style } as ViewStyle
  }

  let outlineStyle
  if (Array.isArray(props.outlineStyle)) {
    outlineStyle = mergeWith(concat, OUTLINE, props.outlineStyle)
  } else {
    outlineStyle = { ...OUTLINE, ...props.outlineStyle } as ViewStyle
  }

  let fillStyle
  if (Array.isArray(props.fillStyle)) {
    fillStyle = mergeWith(concat, FILL, props.fillStyle)
  } else {
    fillStyle = { ...FILL, ...props.fillStyle } as ViewStyle
  }
  const onPress = props.onToggle ? () => props.onToggle && props.onToggle(!props.value) : null

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={!props.onToggle}
      onPress={onPress}
      style={rootStyle}
    >
      <View style={outlineStyle}>{props.value && <View style={fillStyle} />}</View>
      <Text text={props.text} tx={props.tx} numberOfLines={numberOfLines} style={LABEL} />
    </TouchableOpacity>
  )
}
