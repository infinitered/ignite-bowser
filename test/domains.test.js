const domains = require('../lib/domains')

describe('for a new domain', () => {
  let ask = jest.fn()
  let context = {
    prompt: {
      ask
    },
    filesystem: {
      list: jest.fn()
    },
    parameters: {
      options: {}
    }
  }
  beforeAll(() => {
    ask.mockReturnValueOnce(Promise.resolve({ domain: '(Create New)' }))
  })

  it('returns an empty string', async () => {
    const path = await domains.getDomainPath('foo', context)
    expect(path).toEqual('')
  })
})

describe('for an existing domain', () => {
  let ask = jest.fn()
  let context = {
    prompt: {
      ask
    },
    filesystem: {
      list: () => ['users']
    },
    parameters: {
      options: {}
    }
  }
  beforeEach(() => {
    ask.mockReturnValueOnce(Promise.resolve({ domain: 'users' }))
  })

  it('asks the user to choose from available domains', async () => {
    await domains.getDomainPath('foo', context)
    expect(ask.mock.calls[0][0]).toEqual({
      name: 'domain',
      type: 'list',
      message: 'Add this to which domain?',
      choices: ['(Create New)', 'users']
    })
  })

  it('returns the selected path', async () => {
    const path = await domains.getDomainPath('foo', context)
    expect(path).toEqual('users/')
  })
})

describe('when a folder option is passed', () => {
  let ask = jest.fn()
  let context = {
    prompt: {
      ask
    },
    filesystem: {
      list: () => ['users']
    },
    parameters: {
      options: {
        folder: 'bar'
      }
    }
  }

  it('does not prompt the user', async () => {
    await domains.getDomainPath('foo', context)
    expect(ask.mock.calls.length).toEqual(0)
  })

  it('returns the specified path', async () => {
    const path = await domains.getDomainPath('foo', context)
    expect(path).toEqual('bar/')
  })
})

describe('when folder option matches the base directory', () => {
  let ask = jest.fn()
  let context = {
    prompt: {
      ask
    },
    filesystem: {
      list: () => ['users']
    },
    parameters: {
      options: {
        folder: 'models'
      }
    }
  }

  it('returns an empty string (same as new domain)', async () => {
    const path = await domains.getDomainPath('models', context)
    expect(path).toEqual('')
  })
})
