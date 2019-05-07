import { flow, applySnapshot, IStateTreeNode, onSnapshot } from "mobx-state-tree"
import * as Storage from "../../utils/storage"

/**
 * Adds functions to load and save the snapshot to async storage.
 *
 * Saving happens automatically, but loading must be called during the startup
 * process.  For this project that's in the `onReady`.
 *
 * Important: Saving is turned only once loading.
 *
 * mobx-state-tree doesn't have the concept of async `afterAttach` since it's
 * statement management philosophy is all about synchronous updates.
 */
export const withAsyncStorage = (key: string) => (self: IStateTreeNode) => {
  let disposer: Function

  /**
   * Saves the snapshot to async storage.
   *
   * @param snapshot The snapshot to save.
   */
  const save = async (snapshot: {}) => {
    await Storage.save(key, snapshot)
  }

  /**
   * Turns on AsyncStorage saving when the snapshot changes.
   */
  const enableSaving = () => {
    // clear out any existing subscription
    disposer && disposer()

    // listen for changes and save them.
    disposer = onSnapshot(self, snapshot => save(snapshot))
  }

  return {
    actions: {
      /**
       * Loads from async storage.
       */
      loadFromAsyncStorage: flow(function* loadFromAsyncStorage() {
        let data: any = undefined

        // load from async storage
        try {
          data = yield Storage.load(key)

          // apply the snapshot if it is valid
          if (Boolean(data)) {
            applySnapshot(self, data)
          }
        } catch (e) {}

        // now monitor for changes
        enableSaving()

        // send back the data
        return data
      }) as () => Promise<any | undefined>,

      /**
       * Turn on snapshot saving manually.
       */
      enableAsyncStorageAutoSaving() {
        enableSaving()
      },

      beforeDetach() {
        disposer && disposer()
      },
    },
  }
}