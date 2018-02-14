import * as React from "react"
import { Text } from "../../shared/text"
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../../shared/screen"

export interface SecondExampleScreenProps extends NavigationScreenProps<{}> {}

export class SecondExampleScreen extends React.Component<SecondExampleScreenProps, {}> {
  render() {
    return (
      <Screen preset="fixedCenter">
        <Text preset="header" tx="secondExampleScreen.header" />
      </Screen>
    )
  }
}
