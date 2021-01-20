//* Importing and applying dotenv (a module that loads environment variables from a .env.test file into process.env)
require('dotenv').config({
  path: require('path').resolve(__dirname, '../../../.env.test')
})
