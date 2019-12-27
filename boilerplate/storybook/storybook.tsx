import React, { useEffect } from "react"
import { getStorybookUI, configure } from "@storybook/react-native"
import SplashScreen from "react-native-splash-screen"

declare var module

configure(() => {
  require("./storybook-registry")
}, module)

const StorybookUI = getStorybookUI({ port: 9001, host: "localhost", onDeviceUI: true })

export const StorybookUIRoot: React.FunctionComponent = () => {
  useEffect(() => {
    SplashScreen.hide()
    if (typeof __TEST__ === "undefined" || !__TEST__) {
      const Reactotron = require("../app/services/reactotron")
      const reactotron = new Reactotron.Reactotron()
      reactotron.setup()
    }
  }, [])

  return <StorybookUI />
}
