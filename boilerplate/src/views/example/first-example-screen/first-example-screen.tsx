import * as React from "react"
import { Text } from "../../shared/text"
import { Button } from "../../shared/button"
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../../shared/screen"

export interface FirstExampleScreenProps extends NavigationScreenProps<{}> {}

export class FirstExampleScreen extends React.Component<FirstExampleScreenProps, {}> {
  nextScreen = () => this.props.navigation.navigate("secondExample")

  render() {
    return (
      <Screen preset="fixedCenter">
        <Text preset="header" tx="firstExampleScreen.header" />
        <Button tx="firstExampleScreen.nextScreenButton" onPress={this.nextScreen} />
      </Screen>
    )
  }
}
