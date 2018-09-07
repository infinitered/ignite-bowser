import React from "react"
import { getStorybookUI, configure } from "@storybook/react-native"
import SplashScreen from "react-native-splash-screen"
import { Reactotron } from "../src/services/reactotron"

configure(() => {
  require("./storybook-registry")
})

const StorybookUI = getStorybookUI({ port: 9001, host: "", onDeviceUI: true })

// RN hot module must be in a class for HMR
export class StorybookUIRoot extends React.Component {
  componentDidMount() {
    const reactotron = new Reactotron()
    reactotron.setup()
    SplashScreen.hide()
  }
  render() {
    return <StorybookUI />
  }
}
