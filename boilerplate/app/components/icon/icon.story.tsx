import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { Icon } from "./icon"

storiesOf("Icon")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Names", () => (
    <Story>
      <UseCase text="back" usage="The icon for going back">
        <Icon icon="back" />
      </UseCase>
      <UseCase text="bullet" usage="The icon for a bullet point">
        <Icon icon="bullet" />
      </UseCase>
    </Story>
  ))
