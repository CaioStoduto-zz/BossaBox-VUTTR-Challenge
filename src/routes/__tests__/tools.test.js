//* Importing dependencies
// Importing and applying .src/server to test .src/routes/tools
const request = require('supertest')(global.app)

const { randomUser, signCookie } = global.misc
const jTool = global.joi.Tool
const { Tool } = global.models

const defaultTools = require('../../extras/defaultTools.json')
const jwt = require('jsonwebtoken')

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
  const _app = global.app // Using personalized app to test specifically authentication
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
    //* Simulates the user request
    const result = await _request
      .put('/tools')
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: (await randomUser({ authorized: false }))._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(401)
    expect(result.text).toEqual('You\'re logged in, but you aren\'t authorized.')
  })

  test('User', async () => {
    //* Simulates the user request
    const result = await _request
      .put('/tools')
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(200)
    expect(result.text).toEqual('OK')
  })
})

describe('GET /tools', () => {
  test('No parameters', async () => {
    //* Simulates the user request
    const result = await request
      .get('/tools')
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`)

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = jTool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(defaultTools)
  })

  test('?tag=', async () => {
    //* Simulates the user request
    const result = await request
      .get('/tools?tag=')
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`)

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = jTool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(defaultTools)
  })

  test('?tag=a', async () => {
    //* Simulates the user request
    const result = await request
      .get('/tools?tag=a')
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`)

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = jTool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual([])
  })

  test('?tag=node', async () => {
    //* Simulates the user request
    const result = await request
      .get('/tools?tag=node')
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`)

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = jTool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(defaultTools.filter(({ tags }) => tags.includes('node')))
  })

  test('?tag=calendar', async () => {
    //* Simulates the user request
    const result = await request
      .get('/tools?tag=calendar')
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`)

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = jTool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(defaultTools.filter(({ tags }) => tags.includes('calendar')))
  })
})
