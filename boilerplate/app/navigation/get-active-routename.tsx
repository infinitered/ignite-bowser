import { NavigationState, PartialState } from "@react-navigation/native"

// Gets the current screen from navigation state
export default function getActiveRouteName(state: NavigationState | PartialState<NavigationState>) {
  const route = state.routes[state.index]

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state)
  }

  return route.name
}
