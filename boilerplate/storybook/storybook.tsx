import { getStorybookUI, configure } from "@storybook/react-native"

configure(() => {
  require("./storybook-registry")
})

export const StorybookUI = getStorybookUI({ port: 9001, host: "localhost", onDeviceUI: true })
