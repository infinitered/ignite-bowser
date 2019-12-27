import { FunctionComponent, useEffect } from "react"
import { BackHandler } from "react-native"
import { observer } from "mobx-react-lite"
import { NavigationActions } from "react-navigation"
import { useStores } from "../models/root-store"

interface BackButtonHandlerProps {
  /**
   * Are we allowed to exit?
   */
  canExit(routeName: string): boolean
}

export const BackButtonHandler: FunctionComponent<BackButtonHandlerProps> = observer(props => {
  const { navigationStore } = useStores()

  useEffect(() => {
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      // grab the current route
      const routeName = navigationStore.findCurrentRoute().routeName

      // are we allowed to exit?
      if (props.canExit(routeName)) {
        // let the system know we've not handled this event
        return false
      } else {
        // we can't exit, so let's turn this into a back action
        navigationStore.dispatch(NavigationActions.back())
        // let the system know we've handled this event
        return true
      }
    }

    // Subscribe when we come to life
    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    // Unsubscribe when we're done
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [])

  // Just render our children, or nothing if they weren't passed.
  return (props as any).children
})
