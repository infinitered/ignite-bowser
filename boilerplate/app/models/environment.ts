import { Reactotron } from "../services/reactotron"
import { Api } from "../services/api"

/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  constructor() {
    // create each service
    this.reactotron = new Reactotron()
    this.api = new Api()
  }

  async setup() {
    // allow each service to setup
    await this.reactotron.setup()
    await this.api.setup()
  }

  /**
   * Reactotron is only available in dev.
   */
  reactotron: Reactotron

  /**
   * Our api.
   */
  api: Api
}
