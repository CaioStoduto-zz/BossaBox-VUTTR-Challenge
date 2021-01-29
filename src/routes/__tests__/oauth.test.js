//* Importing dependencies
// Importing and applying .src/server to test .src/routes/logout
const request = require('supertest')(global.app) // https://zellwk.com/blog/endpoint-testing/

const OAuth = require('../../util/oauth')

OAuth.GitHub.queries = ['code']
OAuth.GitHub.response = 'The code passed is incorrect or expired.'

test.each(Object.keys(OAuth))('Giving wrong queries for every OAuth Service', async (key) => {
  let url = `/OAuth/${key}?`

  OAuth[key].queries.forEach((query) => {
    url += `${query}=${global.randomString(128)}&`
  })

  url = url.substring(0, url.length - 1)

  const result = await request
    .get(url)

  //* Throws if an error occured
  if (result.err) throw result.err

  expect(result.status).toBe(400)
  expect(result.text.replace(/http:\/\/127.0.0.1:(.{4,5})/g, 'http://127.0.0.1:897')).toBe(`${OAuth[key].response}\n\nSomething went wrong, try again later, http://127.0.0.1:897`)
})
