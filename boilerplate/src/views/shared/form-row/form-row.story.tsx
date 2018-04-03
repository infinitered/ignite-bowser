import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../../storybook/views"
import { FormRow } from "./form-row"
import { Text } from "../text"

storiesOf("FormRow")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Assembled", () => (
    <Story>
      <UseCase
        text="Fully Assembled"
        usage="FormRow has many parts designed to fit together.  Here is what it looks like all assembled."
      >
        <FormRow preset="top">
          <Text preset="fieldLabel">Hello! I am at the top</Text>
        </FormRow>
        <FormRow preset="middle">
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi officia quo rerum
            impedit asperiores hic ex quae, quam dolores vel odit doloribus, tempore atque deserunt
            possimus incidunt, obcaecati numquam officiis.
          </Text>
        </FormRow>
        <FormRow preset="middle">
          <Text preset="secondary">...one more thing</Text>
        </FormRow>
        <FormRow preset="bottom">
          <Text>🎉 Footers!</Text>
        </FormRow>
      </UseCase>
      <UseCase text="Alternatives" usage="Less commonly used presets.">
        <FormRow preset="clear">
          <Text>
            My borders are still there, but they are clear. This causes the text to still align
            properly due to the box model of flexbox.
          </Text>
        </FormRow>
        <FormRow preset="soloRound">
          <Text>I'm round</Text>
        </FormRow>
        <FormRow preset="soloStraight" style={{ marginTop: 10, backgroundColor: "#ffe" }}>
          <Text>I'm square and have a custom style.</Text>
        </FormRow>
      </UseCase>
    </Story>
  ))
  .add("Presets", () => (
    <Story>
      <UseCase text="top" usage="The top of a form.">
        <FormRow preset="top">
          <Text>Curved borders at the top.</Text>
          <Text>Nothing below</Text>
        </FormRow>
      </UseCase>
      <UseCase text="middle" usage="A row in the middle of a form.">
        <FormRow preset="middle">
          <Text>No curves and empty at the bottom.</Text>
        </FormRow>
      </UseCase>
      <UseCase text="bottom" usage="The bottom of a form.">
        <FormRow preset="bottom">
          <Text>Curved at the bottom</Text>
          <Text>Line at the top.</Text>
        </FormRow>
      </UseCase>
      <UseCase text="soloRound" usage="A standalone curved form row.">
        <FormRow preset="soloRound">
          <Text>Curves all around.</Text>
        </FormRow>
      </UseCase>
      <UseCase text="soloStraight" usage="A standalone straight form row.">
        <FormRow preset="soloStraight">
          <Text>Curves nowhere.</Text>
        </FormRow>
      </UseCase>
      <UseCase text="clear" usage="Identical dimensions but transparent edges.">
        <FormRow preset="clear">
          <Text>Curves nowhere.</Text>
        </FormRow>
      </UseCase>
    </Story>
  ))
