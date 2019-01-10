import { ViewStyle, ScrollViewStyle } from "react-native"
import { color } from "../../theme"
import { isEmpty, isNil } from "ramda"

/**
 * The base shape & color.
 */
const SHAPE: ScrollViewStyle = { backgroundColor: color.background, flex: 1 }

/**
 * Governs the default child layout.
 */
const CONTENTS: ViewStyle = { justifyContent: "flex-start", alignItems: "flex-start" }

/**
 * Glues the shape & child layout together since there's no restrictions on view style.
 */
const DOES_NOT_SCROLL: ViewStyle = { ...SHAPE, ...CONTENTS }

// a style-safe value when a preset's sub-style isn't defined
const NOPE = {}

/**
 * All the variations of screens.
 */
export const presets = {
  /**
   * No scrolling. Suitable for full-screen carousels and components
   * which have built-in scrolling like FlatList.
   */
  fixed: {
    nonScroll: DOES_NOT_SCROLL,
    scrollOuter: NOPE,
    scrollInner: NOPE,
  },

  /**
   * No scrolling. Children are stretched to full width.
   */
  fixedStack: {
    nonScroll: { ...DOES_NOT_SCROLL, alignItems: "stretch" } as ViewStyle,
    scrollOuter: NOPE,
    scrollInner: NOPE,
  },

  /**
   * No scrolling. Content is centered on the screen.
   */
  fixedCenter: {
    nonScroll: { ...DOES_NOT_SCROLL, justifyContent: "center", alignItems: "center" } as ViewStyle,
    scrollOuter: NOPE,
    scrollInner: NOPE,
  },

  /**
   * Scrolls. Suitable for forms or other things requiring a keyboard.
   *
   * Pick this one if you don't know which one you want yet.
   */
  scroll: {
    nonScroll: NOPE,
    scrollOuter: SHAPE,
    scrollInner: { ...CONTENTS } as ViewStyle,
  },

  /**
   * Like scroll, but children are stretched to full width.
   */
  scrollStack: {
    nonScroll: NOPE,
    scrollOuter: SHAPE,
    scrollInner: { ...CONTENTS, alignItems: "stretch" } as ViewStyle,
  },
}

/**
 * The variations of screens.
 */
export type ScreenPresets = keyof typeof presets

/**
 * Is this preset a non-scrolling one?
 *
 * @param preset The preset to check
 */
export function isNonScrolling(preset: ScreenPresets) {
  // any of these things will make you scroll
  return !(
    isNil(preset) ||
    isEmpty(preset) ||
    isNil(presets[preset]) ||
    presets[preset].nonScroll === NOPE
  )
}
