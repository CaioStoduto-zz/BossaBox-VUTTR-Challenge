//* Importing dependencies
// Importing and applying .src/server to test .src/routes/tools
const request = require('supertest')(global.app)

const { randomUser, signCookie, mongoObjectId } = global.misc
const jTool = global.joi.Tool
const { Tool } = global.models

const defaultTools = require('../../extras/defaultTools.json')
const jwt = require('jsonwebtoken')

//* Init Database
global.misc.setupDB(false)

let User

let fakeTool = {
  tags: [
    'a',
    'b',
    'c'
  ],
  title: 'A',
  link: 'https://B.CD',
  description: 'E'
}

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
  User = await randomUser()
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
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: (await randomUser({ authorized: false }))._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`])

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
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(200)
    expect(result.text).toEqual('OK')
  })
})

describe('[GET] /tools', () => {
  test('No parameters', async () => {
    //* Simulates the user request
    const result = await request
      .get('/tools')
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)

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
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)

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
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = jTool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual([])
  })

  const _tags = []

  defaultTools.forEach(({ tags }) => {
    tags.forEach((tag) => {
      _tags.push(tag)
    })
  })

  test.each(_tags)('each tag', async (tag) => {
    //* Simulates the user request
    const result = await request
      .get(`/tools?tag=${tag}`)
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)

    const tools = []

    JSON.parse(result.text).forEach((tool) => {
      const { error, value } = jTool.validate(tool)
      if (error) throw error
      tools.push(value)
    })

    expect(result.status).toEqual(200)
    expect(tools).toEqual(defaultTools.filter(({ tags }) => tags.includes(tag)))
  })
})

describe('[POST] /tools', () => {
  beforeEach(() => {
    fakeTool = {
      tags: [
        'a',
        'b',
        'c'
      ],
      title: 'A',
      link: 'https://B.CD',
      description: 'E'
    }
  })

  test.each(Object.keys(fakeTool))('without a required parameter', async (key) => {
    delete fakeTool[key]
    const result = await request
      .post('/tools')
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)
      .send(fakeTool)

    if (result.err) throw result.err

    expect(result.status).toBe(400)
    expect(result.text).toEqual(global.joi.Tool.validate(fakeTool).error.message)
  })

  test('tool.tags = []', async () => {
    fakeTool.tags = []
    const result = await request
      .post('/tools')
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)
      .send(fakeTool)

    if (result.err) throw result.err

    const joir = global.joi.Tool.validate(JSON.parse(result.text))
    if (joir.error) throw joir.error

    expect(result.status).toBe(201)
    expect(joir.value).toMatchObject(fakeTool)

    const tool = await Tool.findById(JSON.parse(result.text)._id)
    const joir1 = global.joi.Tool.validate(JSON.parse(result.text))
    if (joir1.error) throw joir1.error

    expect(joir1.value).toMatchObject(fakeTool)
    await tool.deleteOne()
  })

  test('valid tool', async () => {
    const result = await request
      .post('/tools')
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)
      .send(fakeTool)

    if (result.err) throw result.err

    const joir = global.joi.Tool.validate(JSON.parse(result.text))
    if (joir.error) throw joir.error

    expect(result.status).toBe(201)
    expect(joir.value).toMatchObject(fakeTool)

    const tool = await Tool.findById(JSON.parse(result.text)._id)
    const joir1 = global.joi.Tool.validate(JSON.parse(result.text))
    if (joir1.error) throw joir1.error

    expect(joir1.value).toMatchObject(fakeTool)
    await tool.deleteOne()
  })
})

describe('[DELETE] /tools:id', () => {
  test('valid tool', async () => {
    const tool = await (new Tool(fakeTool).save())

    const result = await request
      .delete(`/tools/${tool._id.toString()}`)
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)

    expect(result.status).toBe(204)
    expect(await Tool.countDocuments({ _id: tool._id })).toBe(0)
  })

  test('valid MongoObjectId', async () => {
    const result = await request
      .delete(`/tools/${mongoObjectId()}`)
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)

    expect(result.status).toBe(204)
  })

  test('invalid MongoObjectId', async () => {
    const result = await request
      .delete(`/tools/${global.randomString(32)}`)
      .set('Cookie', `auth-token=${signCookie(jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)

    expect(result.status).toBe(400)
    expect(result.text).toBe('The Tool ID is invalid.')
  })
})
