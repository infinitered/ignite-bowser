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
import React from "react"
import { PartialState, NavigationState, NavigationContainerRef } from "@react-navigation/native"

/**
 * This is a "dummy" root navigator that will be superceded by a real navigation
 * object once it's set by `setRootNavigation` below.
 */
const DummyRootNavigation = {
  navigate(name: string) {
    name // eslint-disable-line no-unused-expressions
  },
  goBack() {}, // eslint-disable-line @typescript-eslint/no-empty-function
  resetRoot(state?: PartialState<NavigationState> | NavigationState) {}, // eslint-disable-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  getRootState(): NavigationState {
    return {} as any
  },
}

export const RootNavigation = DummyRootNavigation

/**
 * This acts as sort of a "proxy" object and calls the corresponding method on the ref.
 *
 * Basically, if there's a ref set to the _real_ navigation object, then let's go ahead
 * and call methods on it.
 */
export const setRootNavigation = (ref: React.RefObject<NavigationContainerRef>) => {
  for (const method in RootNavigation) {
    RootNavigation[method] = (...args: any) => {
      if (ref.current) {
        return ref.current[method](...args)
      }
    }
  }
}
