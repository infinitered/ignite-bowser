import { createStackNavigator } from "react-navigation"
import { WelcomeScreen } from "../screens/welcome-screen"
import { DemoScreen } from "../screens/demo-screen"

export const PrimaryNavigator = createStackNavigator(
  {
    welcome: { screen: WelcomeScreen },
    demo: { screen: DemoScreen },
  },
  {
    headerMode: "none",
  },
)
