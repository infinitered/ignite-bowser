import React from "react"
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
