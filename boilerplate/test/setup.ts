// we always make sure 'react-native' gets included first
import "react-native"

// libraries to mock
import "./mock-i18n"
import "./mock-reactotron"
import "./mock-textinput"
import "./mock-react-native-languages"

declare global {
  var __TEST__
}
