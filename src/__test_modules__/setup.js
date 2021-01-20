//* Guide https://zellwk.com/blog/jest-and-mongoose/

//* Importing dependencies
const mongoose = require('mongoose')

//* Setting up some properties
mongoose.set('useCreateIndex', true)
mongoose.promise = global.Promise

//* Function that remove all docs from all collections (cleans all collections)
async function removeAllCollections () {
  //* Gets all collections
  const collections = Object.keys(mongoose.connection.collections)

  //* ForEach collection
  collections.forEach(async (collectionName) => {
    //* Sets the collection
    const collection = mongoose.connection.collections[collectionName]
    //* Deletes all docs from collection
    await collection.deleteMany()
  })
}

//* Function that drops all collections
async function dropAllCollections () {
  //* Gets all collections
  const collections = Object.keys(mongoose.connection.collections)

  //* ForEach collection
  collections.forEach(async (collectionName) => {
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
  })
}

//* Exporting the functions to able others modules to use it
module.exports = {
  //* Function that sets up the database
  setupDB (DB_NAME, clearAfterEach = true) {
    //* Before all, connects to Mongoose
    beforeAll(async () => {
      //* URL used to connect to MongoDB
      const connectionURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${DB_NAME}?retryWrites=true`
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
      await mongoose.connection.close()
    })
  }
}
