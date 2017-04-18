import Actions, { reducer, INITIAL_STATE } from '../../App/Redux/GithubRedux'

test('request', () => {
  const username = 'taco'
  const state = reducer(INITIAL_STATE, Actions.userRequest(username))

  expect(state.fetching).toBe(true)
  expect(state.username).toBe(username)
  expect(state.avatar).toBeNull()
})

test('success', () => {
  const avatar = 'http://placekitten.com/200/300'
  const state = reducer(INITIAL_STATE, Actions.userSuccess(avatar))

  expect(state.fetching).toBe(false)
  expect(state.avatar).toBe(avatar)
  expect(state.error).toBeNull()
})

test('failure', () => {
  const state = reducer(INITIAL_STATE, Actions.userFailure())

  expect(state.fetching).toBe(false)
  expect(state.error).toBe(true)
  expect(state.avatar).toBeNull()
})
