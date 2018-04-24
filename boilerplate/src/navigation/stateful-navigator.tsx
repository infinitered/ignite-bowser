import * as React from "react"
import { inject, observer } from "mobx-react"
import { addNavigationHelpers } from "react-navigation"
import { RootNavigator } from "./root-navigator"
import { NavigationStore } from "../models/navigation-store/navigation-store"
import throttle from "lodash.throttle"

interface StatefulNavigatorProps {
  navigationStore?: NavigationStore
}

/**
 * How many ms should we throttle for?
 */
const THROTTLE = 500

/**
 * Additional throttle options that nobody can really remember.
 */
const THROTTLE_OPTIONS = { trailing: false }

@inject("navigationStore")
@observer
export class StatefulNavigator extends React.Component<StatefulNavigatorProps, {}> {
  render() {
    // grab our state & dispatch from our navigation store
    const { state, dispatch, addListener } = this.props.navigationStore

    // create a custom navigation implementation
    const navigation = addNavigationHelpers({
      dispatch: throttle(dispatch, THROTTLE, THROTTLE_OPTIONS),
      state,
      addListener,
    } as any) // (as any is only here until @types/react-navigation is updated)

    return <RootNavigator navigation={navigation} />
  }
}
