//* Importing dependencies
const mongoose = require('mongoose')

test('test database connection', (done) => {
  //* Init the database globally
  require('../database').connect(async () => {
    //* Testing result with expected responses
    expect(mongoose.connection.readyState).toBe(1)

    //* Disconnect Mongoose
    await global.misc.dropAllCollections()
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    done()
  })
}, 3E4) //* Mongoose default timeout is 30 seconds
