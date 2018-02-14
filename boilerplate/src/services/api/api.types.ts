import { GeneralApiProblem } from "./api-problem"

export interface Repo {
  id: number
  name: string
  owner: string
}

export type GetRepoResult = { kind: "ok"; repo: Repo } | GeneralApiProblem
