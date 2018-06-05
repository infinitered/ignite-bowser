import * as React from "react"
import { inject, observer } from "mobx-react"
import { RootNavigator } from "./root-navigator"
import { NavigationStore } from "../navigation/navigation-store"
import throttle from "lodash.throttle"

interface StatefulNavigatorProps {
  navigationStore?: NavigationStore
}

@inject("navigationStore")
@observer
export class StatefulNavigator extends React.Component<StatefulNavigatorProps, {}> {
  render() {
    // grab our state & dispatch from our navigation store
    const { state, dispatch, addListener } = this.props.navigationStore

    // create a custom navigation implementation
    const navigation = {
      dispatch,
      state,
      addListener,
    }

    return <RootNavigator navigation={navigation} />
  }
}
