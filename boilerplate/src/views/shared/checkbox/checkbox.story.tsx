import * as React from "react"
import { View } from "react-native"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../../storybook/views"
import { Checkbox } from "./"
import { Toggle } from "react-powerplug"

storiesOf("Checkbox")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behaviour", () => (
    <Story>
      <UseCase text="The Checkbox" usage="Use the checkbox to represent on/off states.">
        <Toggle initial={false}>
          {({ on, toggle }) => <Checkbox value={on} onToggle={toggle} text="Toggle me" />}
        </Toggle>
      </UseCase>
      <UseCase text="value = true" usage="This is permanently on.">
        <Checkbox value={true} text="Always on" />
      </UseCase>
      <UseCase text="value = false" usage="This is permanantly off.">
        <Checkbox value={false} text="Always off" />
      </UseCase>
    </Story>
  ))
  .add("Styling", () => (
    <Story>
      <UseCase text="multiline = true" usage="For really really long text">
        <Toggle initial={false}>
          {({ on, toggle }) => (
            <View>
              <Checkbox
                text="We’re an App Design & Development Team. Experts in mobile & web technologies. We create beautiful, functional mobile apps and websites. "
                value={on}
                multiline
                onToggle={toggle}
              />
            </View>
          )}
        </Toggle>
      </UseCase>
      <UseCase text=".style" usage="Override the container style">
        <Toggle initial={false}>
          {({ on, toggle }) => (
            <View>
              <Checkbox
                text="Hello there!"
                value={on}
                style={{
                  backgroundColor: "purple",
                  marginLeft: 40,
                  paddingVertical: 30,
                  paddingLeft: 60,
                }}
                onToggle={toggle}
              />
            </View>
          )}
        </Toggle>
      </UseCase>
      <UseCase text=".outlineStyle" usage="Override the outline style">
        <Toggle initial={false}>
          {({ on, toggle }) => (
            <View>
              <Checkbox
                text="Outline is the box frame"
                value={on}
                outlineStyle={{
                  borderColor: "green",
                  borderRadius: 10,
                  borderWidth: 4,
                  width: 60,
                  height: 20,
                }}
                onToggle={toggle}
              />
            </View>
          )}
        </Toggle>
      </UseCase>
      <UseCase text=".fillStyle" usage="Override the fill style">
        <Toggle initial={false}>
          {({ on, toggle }) => (
            <View>
              <Checkbox
                text="Fill er up"
                value={on}
                fillStyle={{ backgroundColor: "red", borderRadius: 8 }}
                onToggle={toggle}
              />
            </View>
          )}
        </Toggle>
      </UseCase>
    </Story>
  ))
