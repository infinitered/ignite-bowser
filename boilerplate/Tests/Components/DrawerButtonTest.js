// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
import React from 'react'
import DrawerButton from '../../App/Components/DrawerButton'
import { shallow } from 'enzyme'

const wrapper = shallow(<DrawerButton onPress={() => {}} text='hi' />)

test('component exists', () => {
  expect(wrapper.length).toBe(1) // exists
})

test('component structure', () => {
  expect(wrapper.name()).toBe('TouchableOpacity') // the right root component
  expect(wrapper.children().length).toBe(1) // has 1 child
  expect(wrapper.children().first().name()).toBe('Text') // that child is Text
})

test('onPress', () => {
  let i = 0
  const onPress = () => i++
  const wrapperPress = shallow(<DrawerButton onPress={onPress} text='hi' />)

  expect(wrapperPress.prop('onPress')).toBe(onPress) // uses the right handler
  expect(i).toBe(0)
  wrapperPress.simulate('press')
  expect(i).toBe(1)
})
