import { reaction, IReactionDisposer } from "mobx"
import debounce from "lodash.debounce"

export interface SideEffectOptions {
  /**
   * Delay firing until a number of milliseconds have passed.
   */
  debounce?: number
}

/**
 * Runs a function when a value changes.
 *
 * @param expression The expression to check for changes.
 * @param effect What to do when we have a new value.
 * @param options Additional options.
 */
export const withSideEffect = <T>(
  expression: () => T,
  effect: (arg: T) => void,
  options: SideEffectOptions = {},
) => {
  // Hold the disposer so we can clean it up when we detach since
  // memory leaks or unfreeable objects are bad.
  let disposer: IReactionDisposer

  return {
    actions: {
      // fires before attaching
      afterAttach() {
        // the mobx reaction
        disposer = reaction(
          expression,
          options.debounce ? debounce(effect, options.debounce) : effect,
          {},
        )
      },

      // fires before detaching
      beforeDetach() {
        disposer && disposer()
      },
    },
  } as any

  // Returning any here because I don't want these actions to show up
  // in the mst type. These are special mst lifecycle events that mst's
  // internals will call.
}