import React from 'react'
import { storiesOf } from '@storybook/react-native'

import RoundedButton from './RoundedButton'

storiesOf('RoundedButton')
  .add('Default', () => (
    <RoundedButton
      text='A simple rounded button'
    />
  ))
  .add('Text as children', () => (
    <RoundedButton>
        Hello from the children!
    </RoundedButton>
  ))
