//* Importing dependencies
// Importing and applying .src/server to test .src/routes/logout
const request = require('supertest')(global.app) // https://zellwk.com/blog/endpoint-testing/

// 🍪 parser that interprets header
const setCookie = require('set-cookie-parser')

//* Testing [GET] /logout
describe('[GET] /logout', () => {
  test('with 🍪 auth-token', async () => {
    //* Simulates the user request
    const result = await request
      .get('/logout')
      .set('Cookie', [`auth-token=${global.randomString(60)}`])

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(
      //* Parses the cookie by the header
      setCookie(result.res.headers['set-cookie'])
        .filter((cookie) => cookie.name === 'auth-token')[0]
    ).toEqual({ //* Expected to the set-cookie be
      name: 'auth-token',
      value: '',
      path: '/',
      expires: new Date(null)
    })
  })

  test('without 🍪 auth-token', async () => {
    //* Simulates the user request
    const result = await request
      .get('/logout')

    //* Throws if an error occured
    if (result.err) throw result.err

    //* Tests the result to proof if it worked properly
    expect(
      //* Parses the cookie by the header
      setCookie(result.res.headers['set-cookie'])
        .filter((cookie) => cookie.name === 'auth-token')[0]
    ).toEqual({ //* Expected to the set-cookie be
      name: 'auth-token',
      value: '',
      path: '/',
      expires: new Date(null)
    })
  })
})
