//* Importing dependencies
// Importing and applying .src/server to test .src/routes/logout
const app = global.app
const jwt = require('jsonwebtoken')
const { randomUser, signCookie, mongoObjectId } = global.misc
const router = require('express').Router()

beforeAll(async () => {
  /**
   * Generates a random string with 5 chars
   * @returns {String} the random string
   */
  function randomSalt () {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const n = charset.length
    let string = ''

    for (let i = 0; i < 5; ++i) {
      string += charset.charAt(Math.floor(Math.random() * n))
    }

    return string
  }

  //* URL used to connect to MongoDB
  const connectionURL = `${process.env.DB_AUTH}/${process.env.DB_NAME}-${randomSalt()}?retryWrites=true`

  //* Options used with MongoDB
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    w: 'majority'
  }

  //* Tries to connect to MongoDB
  await require('mongoose').connect(connectionURL, options)
})

router.get('/', (req, res) => {
  if (req.user) {
    res.status(200)
  } else {
    res.status(404)
  }
  res.send(req.user).end()
})

app.use('/test', router)

const request = require('supertest')(app) // https://zellwk.com/blog/endpoint-testing/

//* Testing Authentication Middleware
describe('Authentication Middleware', () => {
  test('🍪===undefined', async () => {
    //* Simulates the user request
    const result = await request
      .get('/test')
      .set('Cookie', [''])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(404)
    expect(result.body).toEqual({})
  })

  test('(invalid signature 🍪)', async () => {
    //* Simulates the user request
    const result = await request
      .get('/test')
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), global.randomString(100))}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(404)
    expect(result.body).toEqual({})
  })

  test('(unsigned 🍪)', async () => {
    //* Simulates the user request
    const result = await request
      .get('/test')
      .set('Cookie', [`auth-token=${jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '2d' })}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(404)
    expect(result.body).toEqual({})
  })

  test('🍪 && !User && JWT', async () => {
    //* Simulates the user request
    const result = await request
      .get('/test')
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: await mongoObjectId() }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(404)
    expect(result.body).toEqual({})
  })

  test('🍪 && User && !JWT', async () => {
    //* Simulates the user request
    const result = await request
      .get('/test')
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, global.randomString(100), { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(404)
    expect(result.body).toEqual({})
  })
})
