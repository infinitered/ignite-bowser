import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { Wallpaper } from "./wallpaper"

storiesOf("Wallpaper")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="default/stretch" usage="Full screen wallpaper image.">
        <Wallpaper />
      </UseCase>
    </Story>
  ))
