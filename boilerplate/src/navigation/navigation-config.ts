export interface NavigationConfig {
  /**
   * A list of routes from which we're allowed to leave the app when
   * the user presses the back button on Android.
   *
   * Anything not on this list will be a standard `back` action in
   * react-navigation.
   */
  exitRoutes: string[]
}

/**
 * The default navigation config for this app. You'd only really need
 * to override this for testing.
 */
export const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
  exitRoutes: ["firstExample"],
}
