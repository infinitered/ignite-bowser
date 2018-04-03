import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../../storybook/views"
import { Text } from "./text"

storiesOf("Text")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="default" usage="Used for normal body text.">
        <Text>Hello!</Text>
        <Text style={{ paddingTop: 10 }}>
          Check out{"\n"}
          my{"\n"}
          line height
        </Text>
        <Text style={{ paddingTop: 10 }}>The quick brown fox jumped over the slow lazy dog.</Text>
        <Text>$123,456,789.00</Text>
      </UseCase>
      <UseCase text="bold" usage="Used for bolded body text.">
        <Text preset="bold">Osnap! I'm puffy.</Text>
      </UseCase>
      <UseCase text="header" usage="Used for major section headers.">
        <Text preset="header">Behold!</Text>
      </UseCase>
    </Story>
  ))
  .add("Passing Content", () => (
    <Story>
      <UseCase
        text="text"
        usage="Used when you want to pass a value but don't want to open a child."
      >
        <Text text="Heyo!" />
      </UseCase>
      <UseCase text="tx" usage="Used for looking up i18n keys.">
        <Text tx="common.ok" />
        <Text tx="omglol" />
      </UseCase>
      <UseCase
        text="children"
        usage="Used like you would normally use a React Native <Text> component."
      >
        <Text>Passing strings as children.</Text>
      </UseCase>
      <UseCase text="nested children" usage="You can embed them and change styles too.">
        <Text>
          {" "}
          Hello <Text preset="bold">bolded</Text> World.
        </Text>
      </UseCase>
    </Story>
  ))
