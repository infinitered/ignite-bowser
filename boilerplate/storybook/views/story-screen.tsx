import * as React from "react"
import { View, ViewStyle, StatusBar } from "react-native"
import { KeyboardSpacer } from "../../src/views/shared/keyboard-spacer"

const ROOT: ViewStyle = { backgroundColor: "#f0f0f0", flex: 1 }

export interface StoryScreenProps {
  children?: React.ReactNode
  text?: string
}

export const StoryScreen = props => (
  <View style={ROOT}>
    <StatusBar barStyle="light-content" />
    {props.children}
    <KeyboardSpacer />
  </View>
)
