- State management choices in React, & IR's experience
  - local state
  - Redux
  - MST

- Mobx overview
- MST overview
  - where you should use `observer` (I don't think we need to cover `inject` anymore)
- MST in Bowser
  - Our `useStores` context helper

- Tips
  - Connect screens to stores; keep subcomponents mostly pure
  - Access the API via store actions
    - withStatus extension
  - Communicate between stores using extensions
    - withRootStore extension
