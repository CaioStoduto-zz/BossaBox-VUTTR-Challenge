//* Guide https://zellwk.com/blog/jest-and-mongoose/

//* Importing dependencies
const mongoose = require('mongoose')

//* Setting up some properties
mongoose.set('useCreateIndex', true)
mongoose.promise = global.Promise

/**
 * Removes all docs from all collections (cleans all collections) from the database
 */
async function removeAllCollections () {
  //* Gets all collections
  const collections = Object.keys(mongoose.connection.collections)

  //* ForEach collection
  for (const collectionName of collections) {
    //* Sets the collection
    const collection = mongoose.connection.collections[collectionName]
    //* Deletes all docs from collection
    await collection.deleteMany()
  }
}

/**
 * Drops all collections from the database
 */

async function dropAllCollections () {
  //* Gets all collections
  const collections = Object.keys(mongoose.connection.collections)

  //* ForEach collection
  for (const collectionName of collections) {
    //* Sets the collection
    const collection = mongoose.connection.collections[collectionName]

    //* Tries to drop the collection
    try {
      await collection.drop()
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running')) return
      console.log(error.message)
    }
  }
}

/**
 * Sets up the database
 * @param {Boolean} clearAfterEach defines if it will clean the entire database after each individual test
 */
function setupDB (clearAfterEach = true) {
  //* Before all, connects to Mongoose
  beforeAll(async () => {
    //* URL used to connect to MongoDB
    const connectionURL = `${process.env.DB_AUTH}/${process.env.DB_NAME}-${global.randomString(5)}?retryWrites=true`
    //* Options used with MongoDB
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      w: 'majority'
    }

    //* Tries to connect to MongoDB
    await mongoose.connect(connectionURL, options)
  })

  if (clearAfterEach === true) {
    // Cleans up database between each test
    afterEach(async () => {
      await removeAllCollections()
    })
  }

  //* Disconnect Mongoose
  afterAll(async () => {
    await dropAllCollections()
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })
}

/**
 * Sign a var as done in signedCookies
 * @param {*} val any value that you wanna sign as a cookie
 * @param {*} secret the secret key used to sign the val
 * @returns {String} the val signed as a signedCookie
 */
function signCookie (val, secret) {
  return `s%3A${val + '.' + require('crypto')
    .createHmac('sha256', secret)
    .update(val)
    .digest('base64')
    .replace(/=+$/, '')}`
}

const oauths = Object.keys(require('../util/oauth'))

/**
 * reates a new User on the database
 * @param {Object} param0 randomUser config
 * @param {String} param0.authorized if the user is authorized
 * @param {String} param0.identifier the user identifier of the service
 * @param {String} param0.service service used to authenticate the user
 * @returns {MongooseDocument} the user doc
 */
async function randomUser (config = {}) {
  if (typeof config !== 'object') throw new Error('Parameter config needs to be an object.')
  if (typeof config.authorized !== 'boolean') config.authorized = true
  config.identifier = config.identifier || global.randomSecret(20)
  config.service = config.service || oauths[global.getRandomArbitrary(0, (oauths.length - 1))]

  return (await new global.models.User({
    loginIdentifiers: {
      [config.service]: config.identifier
    },
    authorized: config.authorized
  }).save())
}

/**
 * Object that creates a Mongoose doc id
 * @returns {MongooseDocument._id}
 */
function mongoObjectId () {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16)
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
    return (Math.random() * 16 | 0).toString(16)
  }).toLowerCase()
}

//* Exporting the functions to able others modules to use it
module.exports = {
  randomUser,
  setupDB,
  signCookie,
  mongoObjectId,
  dropAllCollections
}
