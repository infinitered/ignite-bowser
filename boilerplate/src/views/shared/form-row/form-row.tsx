import * as React from "react"
import { View } from "react-native"
import { PRESETS } from "./form-row.presets"
import { FormRowProps } from "./form-row.props"
import { concat, mergeWith } from "ramda"

/**
 * A horizontal container component used to hold a row of a form.
 */
export function FormRow(props: FormRowProps) {
  let viewStyle
  if (Array.isArray(props.style)) {
    viewStyle = mergeWith(concat, PRESETS[props.preset], props.style)
  } else {
    viewStyle = {
      ...PRESETS[props.preset],
      ...props.style,
    }
  }
  return (
    <View
      style={viewStyle}
    >
      {props.children}
    </View>
  )
}
