import * as React from "react"
import { View } from "react-native"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../../storybook/views"
import { Toggle } from "react-powerplug"
import { Switch } from "."

storiesOf("Switch")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behaviour", () => (
    <Story>
      <UseCase text="The Toggle Switch" usage="Use the switch to represent on/off states.">
        <Toggle initial={false}>
          {({ on, toggle }) => <Switch value={on} onToggle={toggle} />}
        </Toggle>
      </UseCase>
      <UseCase text="value = true" usage="This is permanently on.">
        <Switch value={true} />
      </UseCase>
      <UseCase text="value = false" usage="This is permanantly off.">
        <Switch value={false} />
      </UseCase>
    </Story>
  ))
  .add("Styling", () => (
    <Story>
      <UseCase text="Custom Styling" usage="Promise me this won't happen.">
        <Toggle initial={false}>
          {({ on, toggle }) => (
            <View>
              <Switch
                trackOnStyle={{ backgroundColor: "green", borderColor: "black" }}
                trackOffStyle={{ backgroundColor: "red", borderColor: "maroon" }}
                thumbOnStyle={{ backgroundColor: "cyan" }}
                thumbOffStyle={{ backgroundColor: "pink" }}
                value={on}
                onToggle={toggle}
              />
            </View>
          )}
        </Toggle>
      </UseCase>
    </Story>
  ))
