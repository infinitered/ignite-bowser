import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity } from 'react-native'
import styles from './Styles/DrawerButtonStyles'
import ExamplesRegistry from '../Services/ExamplesRegistry'

// Note that this file (App/Components/DrawerButton) needs to be
// imported in your app somewhere, otherwise your component won't be
// compiled and added to the examples dev screen.

// Ignore in coverage report
/* istanbul ignore next */
ExamplesRegistry.addComponentExample('Drawer Button', () =>
  <DrawerButton
    text='Example left drawer button'
    onPress={() => window.alert('Your drawers are showing')}
  />
)

class DrawerButton extends Component {
  static propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func
  }

  render () {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Text style={styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }
}

export default DrawerButton
