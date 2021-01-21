/** Environment Variables
 * DB_AUTH (mongodb+srv://{USER}:{DB_PASSWORD}@{DB_HOST})
 * DB_NAME
 * GITHUB_PUBLIC
 * GITHUB_SECRET
 */

//* Importing and applying dotenv (a module that loads environment variables from a .env.test file into process.env)
require('dotenv').config({
  path: require('path').resolve(__dirname, '../../../.env.test')
})

//* Setting a global function that will help in tests (https://stackoverflow.com/questions/1497481/javascript-password-generator)
global.randomString = (length) => {
  const charset = '@#$%{}[]()\\/\'"`~,;:.<>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const n = charset.length
  let string

  for (let i = 0; i < length; ++i) {
    string += charset.charAt(Math.floor(Math.random() * n))
  }

  return string
}

//* Generates those secrets every test to prove that the tests are correct
process.env.COOKIES_SECRET = global.randomString(64)
process.env.JWT_SECRET = global.randomString(64)

//* Function that generates a random number between 2 numbers (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values)
global.getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min
}
