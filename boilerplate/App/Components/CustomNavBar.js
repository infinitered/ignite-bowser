import React from 'react'
import { View, Image, Animated, TouchableOpacity } from 'react-native'
import { Images, Colors } from '../Themes'
import styles from './Styles/CustomNavBarStyles'
import Icon from 'react-native-vector-icons/Ionicons'
import { Actions as NavigationActions } from 'react-native-router-flux'

export default class CustomNavBar extends React.Component {
  render () {
    return (
      <Animated.View style={styles.container}>
        <TouchableOpacity style={styles.leftButton} onPress={NavigationActions.pop}>
          <Icon name='ios-arrow-back' size={34} color={Colors.snow} />
        </TouchableOpacity>
        <Image style={styles.logo} source={Images.clearLogo} />
        <View style={styles.rightButton} />
      </Animated.View>
    )
  }
}
