//* Importing dependencies
const fs = require('fs')
const jwt = require('jsonwebtoken')
const { resolve } = require('path')

//* Setting up env vars
process.env.JWT_SECRET = '0123456789'
process.env.COOKIES_SECRET = '0123456789'

//* Importing more modules that will be used in the proccess
const OAuth = require('../util/oauth')
const { signCookie, mongoObjectId } = require('../__test_modules__/misc')

//* Import the template that will be used to create the final file
let template = fs.readFileSync(resolve(__dirname, './apib.template'), { encoding: 'utf-8' })

//* Creates a object that will be send to the user containing all OAuth links avaliable
const auths = {}
let authstemplates = ''

//* ForEach with all OAuth methods
Object.keys(OAuth).forEach((key) => {
  //* Adds the AuthURL to auths
  auths[key] = OAuth[key].authURL('127.0.0.1:897')

  //* Generates the oauth template and example
  const template = OAuth[key].template

  authstemplates += `\n### ${key} [GET /oauth/${key}/${template.format}]\n\n`

  //* If it has any parameter
  if (Object.keys(template.parameters).length > 0) {
    authstemplates += '+ Parameters\n'

    //* For each parameter
    Object.keys(template.parameters).forEach((key1) => {
      const parameter = template.parameters[key1]
      authstemplates += `    + ${key1}: \``

      //* Switch to generate correct type of random value
      switch (parameter.type) {
        case 'string': {
          authstemplates += `${randomString(parameter.length)}`
          break
        }
      }

      //* Adds it all finally to the template
      authstemplates += `\` (${parameter.required ? 'required' : 'optional'}, ${parameter.type})\n\n+ Response 200\n+ Response 201\n`
    })
  }

  authstemplates += '\n'
})

//* Replaces the template vars with the real vars
template = template
  .replaceAll('%%main_oauth%%', Object.keys(OAuth)[0])
  .replaceAll('%%index.logged.cookie%%', `auth-token=${signCookie(jwt.sign({ _id: mongoObjectId() }, process.env.JWT_SECRET, { expiresIn: '1h' }), process.env.COOKIES_SECRET)}`)
  .replaceAll('%%index.unlogged.result%%', JSON.stringify(auths))
  .replaceAll('%%authstemplates%%', authstemplates)

//* Writes to the final file
fs.writeFileSync(resolve(__dirname, '../../index.apib'), template, { encoding: 'utf-8' })

//* Logs that the file was created
console.log('The file was created.')

/**
   * Generates a random string
   * @param {Number} length the length of the random string
   * @returns {String} the random string
   */
function randomString (length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const n = charset.length
  let string = ''

  for (let i = 0; i < length; ++i) {
    string += charset.charAt(Math.floor(Math.random() * n))
  }

  return string
}
