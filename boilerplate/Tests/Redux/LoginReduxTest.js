import Actions, { reducer, INITIAL_STATE, isLoggedIn } from '../../App/Redux/LoginRedux'

test('attempt', () => {
  const state = reducer(INITIAL_STATE, Actions.loginRequest('u', 'p'))

  expect(state.fetching).toBe(true)
})

test('success', () => {
  const state = reducer(INITIAL_STATE, Actions.loginSuccess('hi'))

  expect(state.username).toBe('hi')
})

test('failure', () => {
  const state = reducer(INITIAL_STATE, Actions.loginFailure(69))

  expect(state.fetching).toBe(false)
  expect(state.error).toBe(69)
})

test('logout', () => {
  const loginState = reducer(INITIAL_STATE, Actions.loginSuccess('hi'))
  const state = reducer(loginState, Actions.logout())

  expect(state.username).toBeFalsy()
})

test('isLoggedIn', () => {
  const state = reducer(INITIAL_STATE, Actions.loginSuccess('hi'))

  expect(isLoggedIn(state)).toBe(true)
})
