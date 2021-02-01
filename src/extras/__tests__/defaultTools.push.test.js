//* Importing dependencies
const mongoose = require('mongoose')
const Tool = require('../../models/tool')
const defaultTools = require('../defaultTools.json')

afterEach(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

test('Pushing tools to the database', (done) => {
  //* Sets a callback that will be executed after all tools have been created
  global.callback = async () => {
    expect(await Tool.countDocuments({})).toBe(defaultTools.length)
    done()
  }

  //* Setting console.log to a function that doesn't do anything to stop flooding in tests
  console.log = () => {}

  //* Executing script
  require('../defaultTools.push')
})
