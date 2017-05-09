// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
import React from 'react'
import FullButton from '../../App/Components/FullButton'
import { shallow } from 'enzyme'

// Basic wrapper
const wrapper = shallow(<FullButton onPress={() => {}} text='hi' />)

test('component exists', () => {
  expect(wrapper.length).toBe(1) // exists
})

test('component structure', () => {
  expect(wrapper.name()).toBe('TouchableOpacity') // the right root component
  expect(wrapper.children().length).toBe(1) // has 1 child
  expect(wrapper.children().first().name()).toBe('Text') // that child is Text
})

test('onPress', () => {
  let i = 0 // i guess i could have used sinon here too... less is more i guess
  const onPress = () => i++
  const wrapperPress = shallow(<FullButton onPress={onPress} text='hi' />)

  expect(wrapperPress.prop('onPress')).toBe(onPress) // uses the right handler
  expect(i).toBe(0)
  wrapperPress.simulate('press')
  expect(i).toBe(1)
})
