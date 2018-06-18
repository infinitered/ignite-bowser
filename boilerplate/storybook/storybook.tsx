import React from "react"
import { getStorybookUI, configure } from "@storybook/react-native"
import SplashScreen from "react-native-splash-screen"

configure(() => {
  require("./storybook-registry")
})

const StorybookUI = getStorybookUI({ port: 9001, host: "localhost", onDeviceUI: true })

// RN hot module must be in a class for HMR
export class StorybookUIRoot extends React.Component {
  componentDidMount() {
    SplashScreen.hide()
  }
  render() {
    return <StorybookUI />
  }
}
