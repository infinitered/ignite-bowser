// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
import React from 'react'
import RoundedButton from '../../App/Components/RoundedButton'
import { shallow } from 'enzyme'

// Basic wrapper
const wrapper = shallow(<RoundedButton onPress={() => {}} text='howdy' />)

test('component exists', () => {
  expect(wrapper.length).toBe(1) // exists
})

test('component structure', () => {
  expect(wrapper.name()).toBe('TouchableOpacity') // the right root component
  expect(wrapper.children().length).toBe(1) // has 1 child
  expect(wrapper.children().first().name()).toBe('Text') // that child is Text
})

test('the text is set properly - uppercase', () => {
  expect(wrapper.children().first().props().children).toBe('HOWDY')
})

test('onPress', () => {
  let i = 0 // i guess i could have used sinon here too... less is more i guess
  const onPress = () => i++
  const wrapperPress = shallow(<RoundedButton onPress={onPress} text='hi' />)

  expect(wrapperPress.prop('onPress')).toBe(onPress) // uses the right handler
  expect(i).toBe(0)
  wrapperPress.simulate('press')
  expect(i).toBe(1)
})

test('renders children text when passed', () => {
  const wrapperChild = shallow(<RoundedButton onPress={() => {}}>Howdy</RoundedButton>)
  expect(wrapperChild.children().length).toBe(1) // has 1 child
  expect(wrapperChild.children().first().name()).toBe('Text') // that child is Text
})
