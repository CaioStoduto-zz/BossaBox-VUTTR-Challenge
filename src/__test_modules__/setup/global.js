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

//* Setting a global vars that will help in tests (https://stackoverflow.com/questions/1497481/javascript-password-generator)
/**
 * Generates a random string
 * @param {Number} length the length of the random string
 * @returns {String} the random string
 */
global.randomString = (length) => {
  const charset = '@#$%{}[]()\\/\'"`~,;:.<>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const n = charset.length
  let string = ''

  for (let i = 0; i < length; ++i) {
    string += charset.charAt(Math.floor(Math.random() * n))
  }

  return string
}

//* Generates those secrets every test to prove that the tests are correct
process.env.COOKIES_SECRET = global.randomString(64)
process.env.JWT_SECRET = global.randomString(64)

//* Setting up some global vars to help programming tests
// (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values)
/**
 * Generates a random number between 2 numbers
 * @param {Number} min the minimum number
 * @param {Number} max the maximum number
 * @returns {Number} the random number
 */
global.getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min
}

// Adding some modules that will facilitate the importing proccess
global.app = require('../../server')
global.misc = require('../misc')

global.models = {
  User: require('../../models/user')
}

global.util = {
  OAuth: require('../../util/oauth')
}
