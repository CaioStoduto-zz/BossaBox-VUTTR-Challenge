//* Importing dependencies
// Importing and applying .src/server to test .src/routes/logout
const app = global.app
let host

//* Middleware to store the host used
app.use('*', (req, res, next) => {
  host = req.get('host')
  next()
})

const request = require('supertest')(app) // https://zellwk.com/blog/endpoint-testing/
const { randomUser, signCookie } = global.misc
const jwt = require('jsonwebtoken')
const OAuth = require('../../util/oauth')

//* Init Database
global.misc.setupDB(false)

//* Testing [GET] /
describe('[GET] /', () => {
  test('User', async () => {
    //* Simulates the user request
    const result = await request
      .get('/')
      .set('Cookie', [`auth-token=${signCookie(jwt.sign({ _id: (await randomUser())._id }, process.env.JWT_SECRET, { expiresIn: '2d' }), process.env.COOKIES_SECRET)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(200)
    expect(result.text).toBe(`Hi, you still logged on! If you want to logout, http://${host}/logout`)
  })

  test('!User', async () => {
    //* Simulates the user request
    const result = await request
      .get('/')
      .set('Cookie', [''])

    //* Creates a object that will be send to the user containing all OAuth links avaliable
    const auths = {}

    //* ForEach with all OAuth methods
    Object.keys(OAuth).forEach((key) => {
      //* Adds the AuthURL to the AuthObject
      auths[key] = OAuth[key].authURL(host)
    })

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(result.status).toBe(401)
    expect(result.body).toEqual(auths)
  })
})
