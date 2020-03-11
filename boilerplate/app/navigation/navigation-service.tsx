import React from "react"
import { PartialState, NavigationState, NavigationContainerRef } from "@react-navigation/native"

export const RootNavigation = {
  navigate(name: string, _params?: any) {
    name
  },
  goBack() {},
  resetRoot(state?: PartialState<NavigationState> | NavigationState) {},
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
