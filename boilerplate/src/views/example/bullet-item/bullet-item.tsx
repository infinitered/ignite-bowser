import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle } from "react-native"
import { Text } from "../../shared/text"
import { Icon } from "../../shared/icon"
import { color, spacing } from "../../../theme"

const BULLET_ITEM: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing[3],
  paddingBottom: spacing[3],  
  borderBottomWidth: 1, 
  borderBottomColor: "#393047", 
}
const BULLET_CONTAINER: ViewStyle = {
  marginRight: spacing[4], 
  marginTop: spacing[2],
}
const BULLET: ImageStyle = {
  width: 8,
  height: 8,
}
const BULLET_TEXT: TextStyle = {
  flex: 1,
  fontSize: 16,
  color: color.palette.lighterGrey,  
}  

export interface BulletItemProps {
  text: string
}

export function BulletItem(props: BulletItemProps) {
  return (
    <View style={BULLET_ITEM}>
      <Icon icon="bullet" containerStyle={BULLET_CONTAINER} style={BULLET} />
      <Text style={BULLET_TEXT} text={props.text} />
    </View>
  )
}
