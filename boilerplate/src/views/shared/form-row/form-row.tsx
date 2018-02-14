import * as React from "react"
import { View } from "react-native"
import { PRESETS } from "./form-row.presets"
import { FormRowProps } from "./form-row.props"

/**
 * A horizontal container component used to hold a row of a form.
 */
export function FormRow(props: FormRowProps) {
  return (
    <View
      style={{
        ...PRESETS[props.preset],
        ...props.style,
      }}
    >
      {props.children}
    </View>
  )
}
