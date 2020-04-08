import { useEffect, useRef } from "react"
import { BackHandler } from "react-native"
import { NavigationContainerRef } from "@react-navigation/native"
import getActiveRouteName from "./get-active-routename"

export function useBackButtonHandler(
  ref: React.RefObject<NavigationContainerRef>,
  canExit: (routeName: string) => boolean,
) {
  const canExitRef = useRef(canExit)

  useEffect(() => {
    canExitRef.current = canExit
  }, [canExit])

  useEffect(() => {
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      const navigation = ref.current

      if (navigation == null) {
        return false
      }

      // grab the current route
      const routeName = getActiveRouteName(navigation.getRootState())

      // are we allowed to exit?
      if (canExitRef.current(routeName)) {
        // let the system know we've not handled this event
        return false
      }

      // we can't exit, so let's turn this into a back action
      if (navigation.canGoBack()) {
        navigation.goBack()

        return true
      }

      return false
    }

    // Subscribe when we come to life
    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    // Unsubscribe when we're done
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [ref])
}
