import * as React from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Text } from "../../shared/text"
import { Button } from "../../shared/button"
import { Screen } from "../../shared/screen"
import { Wallpaper } from "../../shared/wallpaper"
import { Header } from "../../shared/header"
import { color, spacing } from "../../../theme"
import { bowserLogo } from "./"

const ROOT: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = { 
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
  alignItems: "center",
}
const TEXT: TextStyle = { color: color.palette.white }
const EXTRA_BOLD: TextStyle = { fontWeight: "900" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = { 
  ...TEXT,
  ...EXTRA_BOLD,
  fontSize: 13,
  textAlign: "center",
  letterSpacing: 2,
}
const TITLE: TextStyle = { 
  ...TEXT, 
  ...EXTRA_BOLD,
  fontSize: 28,
  textAlign: "center",
}
const ALMOST: TextStyle = { 
  ...TEXT, 
  ...EXTRA_BOLD,
  fontSize: 26,
  fontStyle: "italic",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}
const CONTENT: TextStyle = {
  color: color.palette.lighterGrey,  
  alignSelf: "flex-start",
  fontSize: 16,
  lineHeight: 24,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = { 
  paddingVertical: spacing[4], 
  paddingHorizontal: spacing[4],
  backgroundColor: "#5c2754",
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...EXTRA_BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20172c" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4], 
  paddingHorizontal: spacing[4],
}

export interface FirstExampleScreenProps extends NavigationScreenProps<{}> {}

export class FirstExampleScreen extends React.Component<FirstExampleScreenProps, {}> {
  nextScreen = () => this.props.navigation.navigate("secondExample")

  render() {
    return (
      <View style={ROOT}>
        <Wallpaper />
        <SafeAreaView style={ROOT}>
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="scroll">
            <Header
              headerTx="firstExampleScreen.poweredBy"
              style={HEADER}
              titleStyle={HEADER_TITLE}
            />
            <Text> 
              <Text style={TITLE} preset="header" text="Your new app, " />
              <Text style={ALMOST} preset="header" text="almost" />
              <Text style={TITLE} preset="header" text="!" />
            </Text>
            <Text style={TITLE} preset="header" tx="firstExampleScreen.readyForLaunch" />          
            <Image source={bowserLogo} style={BOWSER} />
            <Text style={CONTENT}>
              This probably isn't what your app is going to look like. Unless your designer handed you this screen and, in that case, congrats! You're ready to ship.
            </Text>
            <Text style={CONTENT}>
              For everyone else, this is where you'll see a live preview of your fully functioning app using Ignite.
            </Text>
          </Screen>
        </SafeAreaView>
        <SafeAreaView style={FOOTER}>
          <View style={FOOTER_CONTENT}>
            <Button
              style={CONTINUE}
              textStyle={CONTINUE_TEXT}
              tx="firstExampleScreen.continue"
              onPress={this.nextScreen}
              />
          </View>
        </SafeAreaView>
      </View>
    )
  }
}
