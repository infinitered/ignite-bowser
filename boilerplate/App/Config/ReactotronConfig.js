// import { StartupTypes } from '../Redux/StartupRedux'
import Config from '../Config/DebugConfig'
import Immutable from 'seamless-immutable'
import Reactotron from 'reactotron-react-native'
import { reactotronRedux as reduxPlugin } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'

if (Config.useReactotron) {
  Reactotron
    // configure how & where to talk to the Desktop App
    .configure({
      // host: '10.0.3.2' // default is localhost (on android don't forget to `adb reverse tcp:9090 tcp:9090`)
      name: 'Ignite App' // would you like to see your app's name?,
      // safeRecursion: false  // ADVANCED: default is true (turning off will bypass reactotron's safety checks for serialization)
    })

    // register all React Native features - with default settings
    .useReactNative(
      // {
      //   overlay: {},
      //   errors: {},
      //   asyncStorage: {},
      //   networking: {},
      //   editor: {}
      // }
    )

    // register the Redux plugin -- checkout /App/Redux/CreateStore.js to see how it is used.
    .use(reduxPlugin({
      // you can flag some of your actions as important by returning true here
      // isActionImportant: action => action.type === StartupTypes.STARTUP,

      // you can flag to exclude certain types too... especially the chatty ones
      // except: ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED', 'persist/REHYDRATE'],

      // Fires when Reactotron uploads a new copy of the state tree.  Since our reducers are
      // immutable with `seamless-immutable`, we ensure we convert to that format.
      onRestore: state => Immutable(state)
    }))

    // register the redux-saga plugin so we can use the monitor in CreateStore.js
    .use(sagaPlugin())

    // let's connect!
    .connect()

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear()

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron
} else {
  // a mock version should you decide to leave console.tron in your codebase
  console.tron = {
    log: () => false,
    warn: () => false,
    error: () => false,
    display: () => false,
    image: () => false
  }
}
