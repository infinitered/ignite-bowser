import * as React from "react"
import { Keyboard, View } from "react-native"

export interface KeyboardSpacerState {
  /**
   * The height we'll be reserving.
   */
  keyboardHeight: number
}

export interface KeyboardSpacerProps {
  /**
   * Fires this optional callback when we are about to show.
   */
  onShowing?: () => void
  /**
   * Fires this optional callback when we are about to hide.
   */
  onHiding?: () => void
  /**
   * Additional offsets when you just can't make things line up.  Use
   * this as a last resort.
   */
  offset?: number
}

// @types/react-native never had these, so let's define them here.

interface KeyboardCoordinates {
  height: number
}

interface KeyboardEvent {
  endCoordinates: KeyboardCoordinates
}

/**
 * Place this at the bottom of your forms/scrollviews to reserve space in the container
 * for when the keyboard appears.
 *
 * React Native has its own KeyboardAvoidingView for this, however:
 *
 * 1. it didn't always
 * 2. i find it confusing
 *
 * Prefer to use theirs if you can, but if you just give up and want a working version
 * without the struggle, welcome.
 *
 * (The fact that this is very "Get off my lawn" is not lost on me.)  =)
 */
export class KeyboardSpacer extends React.Component<KeyboardSpacerProps, KeyboardSpacerState> {
  state = { keyboardHeight: 0 }

  disposeShowListener: any
  disposeHideListener: any

  /**
   * When we first get attached, we'll subscribe to Keyboard for events.
   */
  componentWillMount() {
    this.disposeShowListener = Keyboard.addListener("keyboardWillShow", this.handleKeyboardWillShow)
    this.disposeHideListener = Keyboard.addListener("keyboardWillHide", this.handleKeyboardWillHide)
  }

  /**
   * When we leave, we clean up after ourself.
   */
  componentWillUnmount() {
    this.disposeShowListener.remove()
    this.disposeHideListener.remove()
  }

  /**
   * Render
   */
  render() {
    const offset = this.props.offset || 0
    const height = this.state.keyboardHeight + offset
    return <View pointerEvents="none" style={{ height }} />
  }

  /**
   * Fires when we're about to show the keyboard.
   */
  handleKeyboardWillShow = (event: KeyboardEvent) => {
    this.setState({ keyboardHeight: event.endCoordinates.height })
    this.props.onShowing && this.props.onShowing()
  }

  /**
   * Fires when we're about to hide the keyboard.
   */
  handleKeyboardWillHide = (event: KeyboardEvent) => {
    this.setState({ keyboardHeight: 0 })
    this.props.onHiding && this.props.onHiding()
  }
}
