import { createStackNavigator } from "react-navigation"
import { FirstExampleScreen } from "../screens/first-example-screen"
import { SecondExampleScreen } from "../screens/second-example-screen"

export const ExampleNavigator = createStackNavigator({
  firstExample: { screen: FirstExampleScreen },
  secondExample: { screen: SecondExampleScreen },
},
{
  headerMode: "none",
})
