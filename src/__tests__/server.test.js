//* Importing dependencies
// Importing and applying .src/server to test .src/routes/server
const app = global.app
const jwt = require('jsonwebtoken')
const { randomUser, signCookie, mongoObjectId } = global.misc
const router = require('express').Router()

//* Init Database
global.misc.setupDB(false)

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

test('Rate Limit', async () => {
  const appRateLimit = require('express')()
  const requests = []

  appRateLimit.use('*', (new (require('express-rate-limit'))({
    windowMs: 3E6 /* 5 minute */,
    max: 10,
    message: 'Too many accounts created from this IP, please try again after 15 minutes.'
  })))

  appRateLimit.get('/', (req, res, next) => {
    res.status(200).send('OK').end()
    next()
  })

  const requestRateLimit = require('supertest')(appRateLimit)

  for (let i = 0; i < 10; i++) {
    requests[i] = requestRateLimit.get('/')
  }

  await requests.forEach(async (_request) => { await _request })

  //* Simulates the user request
  const result = await requestRateLimit
    .get('/')

  //* Throws if an error occured
  if (result.err) throw result.err

  //* Tests the result to proof if it worked properly
  expect(result.status).toBe(429)
  expect(result.text).toEqual('Too many accounts created from this IP, please try again after 15 minutes.')
})

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
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), global.randomSecret(100))}`])

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
      .set('Cookie', [`auth-token=${jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '1h' })}`])

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
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: await mongoObjectId() }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(404)
    expect(result.body).toEqual({})
  })

  test('🍪 && (invalid User._id syntax) && JWT', async () => {
    //* Simulates the user request
    const result = await request
      .get('/test')
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: `${mongoObjectId()}${mongoObjectId()}` }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`])

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
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, global.randomSecret(100), { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(404)
    expect(result.body).toEqual({})
  })

  test('🍪 && User && JWT', async () => {
    const user = await randomUser()

    //* Simulates the user request
    const result = await request
      .get('/test')
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(200)
    expect(result.body._id).toEqual(user._id.toString())
  })
})
