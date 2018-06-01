import { createStackNavigator } from "react-navigation"
import { FirstExampleScreen } from "../views/example/first-example-screen"
import { SecondExampleScreen } from "../views/example/second-example-screen"

export const ExampleNavigator = createStackNavigator({
  firstExample: { screen: FirstExampleScreen },
  secondExample: { screen: SecondExampleScreen },
},
{
  headerMode: "none",
})
