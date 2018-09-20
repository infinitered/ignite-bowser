import { types } from "mobx-state-tree"
import { EventType, NavigationEventCallback } from "react-navigation"

/**
 * This mobx-state-tree model bestows a few events for working with `react-navigation`
 * events.
 *
 * You use can `compose` or build directly off this to mixin these features.
 */
export const NavigationEvents = types.model("NavigationEvents").volatile(self => {
  // who is currently subscribed to react-navigation events
  const subs = new Set<NavigationEventCallback>()

  /**
   * Fires after we change our state.  You call this from the dispatch
   * to ensure any subscribers are told about state changes.
   *
   * @param action The react-navigation action which triggered this update.
   * @param oldState The previous navigation state.
   * @param newState The next navigation state.
   */
  const fireSubscribers = (action: any, oldState: any, newState: any) => {
    // tell each subscriber out this
    subs.forEach(subscriber => {
      subscriber({
        type: "action",
        action,
        state: newState,
        lastState: oldState,
      })
    })
  }

  /**
   * Provides a way from screens (for example) to subscribe to `react-navigation`
   * events.
   *
   * @param eventName The event.
   * @param handler Some strange handler
   */
  const addListener = (eventName: EventType, handler: NavigationEventCallback) => {
    if (eventName !== "action") {
      return { remove: () => {} }
    }

    // subscribe
    subs.add(handler)

    // return the instructions on how to unsubscribe
    return {
      remove: () => subs.delete(handler),
    }
  }

  return { addListener, fireSubscribers, subs}
})
