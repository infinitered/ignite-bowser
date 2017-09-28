import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'

// create our store
const store = createStore()

/**
* From Redux 2.0.0, HMR for reducers is not by default.
* To avoid an error when we change a reducer, a saga or a container, we must explicitely reload the store
* For unknown reason there is still an error at first reloading but then it leave and the store is updated
* TODO: investigate on this first strange error, the HMR still works
*
* <Provider> does not support changing `store` on the fly. It is most likely that you see this error because
* you updated to Redux 2.x and React Redux 2.x which no longer hot reload reducers automatically.
* See https://github.com/reactjs/react-redux/releases/tag/v2.0.0 for the migration instructions.
*/
if (module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = require('../Redux')
    store.replaceReducer(nextRootReducer.default)
  })
}

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
