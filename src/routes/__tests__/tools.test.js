//* Importing dependencies
const jwt = require('jsonwebtoken')

const { randomUser, signCookie } = global.misc
const { Tool } = global.models

const defaultTools = require('../../extras/defaultTools.json')

//* Init Database
global.misc.setupDB(false)

//* Adding default tools to use in tests
beforeAll(async () => {
  defaultTools.forEach(async (defaultTool) => {
    await (new Tool({
      title: defaultTool.title,
      link: defaultTool.link,
      description: defaultTool.description,
      tags: defaultTool.tags
    }).save())
  })
})

//* Just delete the users
afterEach(async () => {
  const collection = require('mongoose').connection.collections.users
  await collection.deleteMany()
})

describe('Authentication Middleware', () => {
  //* Using a unused route to test authentication
  const _app = global.app
  _app.put('/tools', (req, res, next) => {
    return res.status(200).send('OK').end()
  })

  const _request = require('supertest')(_app)

  test('!User', async () => {
    //* Simulates the user request
    const result = await _request
      .put('/tools')
      .set('Cookie', [''])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(401)
    expect(result.text.replace(/http:\/\/127.0.0.1:(.{4,5})/g, 'http://127.0.0.1:897')).toEqual('You aren\'t logged in.\n\nPlease authenticate using: "http://127.0.0.1:897"\n\nWarning: the authentication uses cookies 🍪 (auth-token)')
  })

  test('User.authorized === false', async () => {
    const user = await randomUser({ authorized: false })

    //* Simulates the user request
    const result = await _request
      .put('/tools')
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(401)
    expect(result.text).toEqual('You\'re logged in, but you aren\'t authorized.')
  })
})
