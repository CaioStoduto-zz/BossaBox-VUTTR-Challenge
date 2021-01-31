//* Importing dependencies
const { auth, findOrCreateUser } = require('../misc')
const { randomUser, Res } = global.misc
const { User } = global.models

const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const oauths = Object.keys(require('../oauth'))

//* Init Database
global.misc.setupDB()

test('force res errors', async () => {
  const res = new Res()

  res.status(203)
  res._message = 'aaaa'
  res.end()

  const error = '[ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client'

  expect(() => {
    res.status(200)
  }).toThrow(error)

  expect(() => {
    res.send('bbbb')
  }).toThrow(error)

  expect(res._status).toBe(203)
  expect(res._message).toEqual('aaaa')
})

//* Testing function authURL of each OAuth service
describe('auth()', () => {
  test('new user', async () => {
    const res = new Res()
    const service = oauths[global.getRandomArbitrary(0, (oauths.length - 1))]
    const identifier = global.randomSecret(20)

    await auth(res, { service, identifier })

    expect(res._status).toBe(201)
    expect(res._message).toEqual("You're a new user, wecolme!")
    expect(res._ended).toBe(true)

    const foundUsers = await User.find({ loginIdentifiers: { [service]: identifier } })

    expect(foundUsers).toHaveLength(1)

    const jwtToken = cookieParser.signedCookie(decodeURIComponent(res._cookies.filter((cookie) => cookie.name === 'auth-token')[0].value), process.env.COOKIES_SECRET)
    const { _id } = jwt.verify(jwtToken, process.env.JWT_SECRET, { expiresIn: '1d' })

    expect(_id).toEqual(foundUsers[0]._id.toString())
  })

  test('existing user', async () => {
    const res = new Res()
    const user = await randomUser()
    const list = Array.from(user.loginIdentifiers.keys())
    const service = list[0]
    const identifier = user.loginIdentifiers.get(service)

    await auth(res, { service, identifier })

    expect(res._status).toBe(200)
    expect(res._message).toEqual("You're logged in.")
    expect(res._ended).toBe(true)

    const jwtToken = cookieParser.signedCookie(decodeURIComponent(res._cookies.filter((cookie) => cookie.name === 'auth-token')[0].value), process.env.COOKIES_SECRET)
    const { _id } = jwt.verify(jwtToken, process.env.JWT_SECRET, { expiresIn: '1d' })

    expect(_id).toEqual(user._id.toString())
  })
})

describe('findOrCreateUser()', () => {
  test('find user', async () => {
    const user = await randomUser()
    const list = Array.from(user.loginIdentifiers.keys())
    const service = list[0]
    const identifier = user.loginIdentifiers.get(service)

    //* Executing the function
    const result = await findOrCreateUser({ service, identifier })

    //* Testing result with expected responses
    expect(result.status).toBe(200)
    expect(result.user._id).toEqual(user._id)
  })

  test('createUser', async () => {
    const service = oauths[global.getRandomArbitrary(0, (oauths.length - 1))]
    const identifier = global.randomSecret(20)

    //* Executing the function
    const result = await findOrCreateUser({ service, identifier })

    //* Testing result with expected responses
    expect(result.status).toBe(201)
    expect(await User.countDocuments({ _id: result.user._id })).toBe(1)
  })
})
