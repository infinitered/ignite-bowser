// This is the storybook setup for native.
import { AppRegistry } from "react-native"
import { getStorybookUI, configure } from "@storybook/react-native"

// import stories
configure(() => {
  require("./storybook-registry")
}, module)

// This assumes that storybook is running on the same host as your RN packager,
// to set manually use, e.g. host: 'localhost' option
const StorybookUI = getStorybookUI({ port: 9002, onDeviceUI: false })
AppRegistry.registerComponent("Ignite", () => StorybookUI)
export default StorybookUI
