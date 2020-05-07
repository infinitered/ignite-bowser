/**
 * This service allows us to "control" the navigation globally by importing
 * it and using it like so:
 *
 * import { RootNavigation } from '../navigation'
 *
 * RootNavigation.navigate('some-route')
 *
 * If no navigator has been set, it will simply ignore all commands sent to it.
 */
import React, { useEffect, useRef } from "react"
import { BackHandler } from "react-native"
import { PartialState, NavigationState, NavigationContainerRef } from "@react-navigation/native"

export const RootNavigation = {
  navigate(name: string) {
    name // eslint-disable-line no-unused-expressions
  },
  goBack() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  resetRoot(state?: PartialState<NavigationState> | NavigationState) {}, // eslint-disable-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  getRootState(): NavigationState {
    return {} as any
  },
}

export const setRootNavigation = (ref: React.RefObject<NavigationContainerRef>) => {
  for (const method in RootNavigation) {
    RootNavigation[method] = (...args: any) => {
      if (ref.current) {
        return ref.current[method](...args)
      }
    }
  }
}

/**
 * Hook that handles Android back button presses and forwards those on to
 * the navigation or allows exiting the app.
 */
export function useBackButtonHandler(
  ref: React.RefObject<NavigationContainerRef>,
  canExit: (routeName: string) => boolean,
) {
  const canExitRef = useRef(canExit)

  useEffect(() => {
    canExitRef.current = canExit
  }, [canExit])

  useEffect(() => {
    // This fires when the back button is pressed on Android.
    const onBackPress = () => {
      const navigation = ref.current

      // no navigation is active, so ignore it
      if (navigation == null) return false

      // grab the current route
      const routeName = getActiveRouteName(navigation.getRootState())

      // are we allowed to exit? If so, let the system know we didn't handle this
      if (canExitRef.current(routeName)) return false

      // we can't exit, so let's turn this into a back action
      if (navigation.canGoBack()) {
        navigation.goBack()
        // let the system know we handled it, and to ignore the back press
        return true
      }

      // we can't go back anymore, so we're just going to have to exit anyway
      return false
    }

    // Subscribe when we come to life
    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    // Unsubscribe when we're done
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [ref])
}

/**
 * Gets the current screen from any navigation state.
 */
export default function getActiveRouteName(state: NavigationState | PartialState<NavigationState>) {
  const route = state.routes[state.index]

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state)
  }

  return route.name
}
