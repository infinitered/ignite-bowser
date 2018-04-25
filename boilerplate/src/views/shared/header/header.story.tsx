import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../../storybook/views"
import { Header } from "./header"

storiesOf("Header")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noPad text="default" usage="The default usage">
        <Header
          headerTx="secondExampleScreen.howTo"
        />
      </UseCase>
      <UseCase noPad text="leftIcon" usage="A left nav icon">
        <Header
          headerTx="secondExampleScreen.howTo"
          leftIcon="back"
          onLeftPress={() => window.alert("left nav")}
        />
      </UseCase>
      <UseCase noPad text="rightIcon" usage="A right nav icon">
        <Header
          headerTx="secondExampleScreen.howTo"
          rightIcon="bullet"
          onRightPress={() => window.alert("right nav")}
        />
      </UseCase>
    </Story>
  ))