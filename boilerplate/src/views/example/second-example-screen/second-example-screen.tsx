import * as React from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../../shared/screen"
import { Text } from "../../shared/text"
import { Button } from "../../shared/button"
import { Wallpaper } from "../../shared/wallpaper"
import { Header } from "../../shared/header"
import { color, spacing } from "../../../theme"
import { logoIgnite, heart } from "./"
import { BulletItem } from "../bullet-item"
import { Api } from "../../../services/api"
import { save } from "../../../lib/storage"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const DEMO: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const DEMO_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
}
const TAGLINE: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[4] + spacing[1],
}
const IGNITE: ImageStyle = {
  marginVertical: spacing[6],
  alignSelf: "center",
}
const LOVE_WRAPPER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "center",
}
const LOVE: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
}
const HEART: ImageStyle = {
  marginHorizontal: spacing[2],
  width: 10,
  height: 10,
  resizeMode: "contain",
}

export interface SecondExampleScreenProps extends NavigationScreenProps<{}> {}

export class SecondExampleScreen extends React.Component<SecondExampleScreenProps, {}> {
  goBack = () => this.props.navigation.goBack(null)

  demoReactotron = async () => {
    console.tron.log("Your Friendly tron log message")
    console.tron.logImportant("I am important")
    console.tron.display({
      name: "Witty Here",
      value: {a: 1, b: [1,2,3]},
      preview: "when you click here, it might surprise you!",
      important: true,
      image: { uri: "https://avatars2.githubusercontent.com/u/997157?s=460&v=4" },
    })
    // make an API call for the demo
    // Don't do API like this, use store's API
    const demo = new Api()
    demo.setup()
    demo.getRepo("infinitered/ignite")
    // Let's do some async storage stuff
    await save("Cool Name", "Boaty McBoatface")
  }

  render() {
    return (
      <View style={FULL}>
        <Wallpaper />
        <SafeAreaView style={FULL}>
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="scrollStack">
            <Header
              headerTx="secondExampleScreen.howTo"
              leftIcon="back"
              onLeftPress={this.goBack}
              style={HEADER}
              titleStyle={HEADER_TITLE}
            />
            <Text style={TITLE} preset="header" tx={"secondExampleScreen.title"} />
            <Text style={TAGLINE} tx={"secondExampleScreen.tagLine"} />
            <BulletItem text="Load up Reactotron!  You can inspect your app, view the events, interact, and so much more!" />
            <BulletItem text="Integrated here, Navigation with State, TypeScript, Storybook, Solidarity, and i18n." />

            <View>
              <Button
                style={DEMO}
                textStyle={DEMO_TEXT}
                tx="secondExampleScreen.reactotron"
                onPress={this.demoReactotron}
                />
            </View>
            <Image source={logoIgnite} style={IGNITE} />
            <View style={LOVE_WRAPPER}>
              <Text style={LOVE} text="Made with" />
              <Image source={heart} style={HEART} />
              <Text style={LOVE} text="by Infinite Red" />
            </View>
          </Screen>
        </SafeAreaView>
      </View>
    )
  }
}
