import * as React from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView, Dimensions, Text as RText } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../../shared/screen"
import { Text } from "../../shared/text"
import { Wallpaper } from "../../shared/wallpaper"
import { Header } from "../../shared/header"
import { color, spacing } from "../../../theme"
import { logoIgnite, heart } from "./"
import { BulletItem } from "../bullet-item"

const ROOT: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = { 
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
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
  marginBottom: spacing[4],  
}
const TAGLINE: TextStyle = {
  color: color.palette.lighterGrey,  
  fontSize: 16,
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
  color: color.palette.lighterGrey,  
  fontSize: 16,
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
      <View style={ROOT}>
        <Wallpaper />
        <SafeAreaView style={ROOT}>
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="scrollStack">
            <Header
              headerTx="secondExampleScreen.howTo"
              leftIcon="back"
              onLeftPress={this.goBack}
              style={HEADER}
              titleStyle={HEADER_TITLE}
            />
            <Text style={TITLE} preset="header" tx={"secondExampleScreen.igniteNext"} />>
            <Text style={TAGLINE} tx={"secondExampleScreen.tagLine"} />
            <BulletItem text="Cupidatat sint et excepteur nulla ad sit reprehenderit sint eu sint quis do consectetur irure." />
            <BulletItem text="Adipisicing sint proident nostrud commodo esse do nulla exercitation non dolore Lorem nisi sunt." />
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
