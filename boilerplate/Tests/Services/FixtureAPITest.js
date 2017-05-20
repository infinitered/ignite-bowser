import API from '../../App/Services/Api'
import FixtureAPI from '../../App/Services/FixtureApi'
import R from 'ramda'

test('All fixtures map to actual API', () => {
  const fixtureKeys = R.keys(FixtureAPI).sort()
  const apiKeys = R.keys(API.create())

  const intersection = R.intersection(fixtureKeys, apiKeys).sort()

  // There is no difference between the intersection and all fixtures
  expect(R.equals(fixtureKeys, intersection)).toBe(true)
})

test('FixtureAPI getRate returns the right file', () => {
  const expectedFile = require('../../App/Fixtures/rateLimit.json')

  expect(FixtureAPI.getRate()).toEqual({
    ok: true,
    data: expectedFile
  })
})

test('FixtureAPI getUser returns the right file for gantman', () => {
  const expectedFile = require('../../App/Fixtures/gantman.json')

  expect(FixtureAPI.getUser('GantMan')).toEqual({
    ok: true,
    data: expectedFile
  })
})

test('FixtureAPI getUser returns the right file for skellock as default', () => {
  const expectedFile = require('../../App/Fixtures/skellock.json')

  expect(FixtureAPI.getUser('Whatever')).toEqual({
    ok: true,
    data: expectedFile
  })
})
