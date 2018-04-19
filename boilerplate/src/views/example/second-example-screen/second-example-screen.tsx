import * as React from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../../shared/screen"
import { Text } from "../../shared/text"
import { Wallpaper } from "../../shared/wallpaper"
import { Header } from "../../shared/header"
import { color, spacing } from "../../../theme"
import { logoIgnite, heart } from "./"
import { BulletItem } from "../bullet-item"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = { 
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = { 
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
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
            <BulletItem text="Occaecat duis aliqua dolor Lorem duis reprehenderit eiusmod sint nulla quis." />            
            <BulletItem text="Nemo enem ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit." />
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
