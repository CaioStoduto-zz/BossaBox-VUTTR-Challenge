//* Importing dependencies
const mongoose = require('mongoose')

//* Disconnect Mongoose
afterEach(async () => {
  await global.misc.dropAllCollections()
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

test('test database connection', async () => {
  //* Init the database globally
  await require('../database').connect(() => {
    expect(mongoose.connection.readyState).toBe(1)
  })
})
