/** Environment Variables
 * DB_AUTH (mongodb+srv://{USER}:{DB_PASSWORD}@{DB_HOST})
 * DB_NAME
 */

//* Importing and applying dotenv (a module that loads environment variables from a .env file into process.env)
require('dotenv').config()

//* Importing dependencies
const mongoose = require('mongoose')
const defaultTools = require('./defaultTools.json')
const Tool = require('../models/tool')

//* If an error occurs, it will log in the console
mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

//* Tries to connect to MongoDB
mongoose.connect(`${process.env.DB_AUTH}/${process.env.DB_NAME}?retryWrites=true`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  w: 'majority'
}, async (err) => {
  //* If an error occurs
  if (err) {
    throw err
  } else {
    //* Logs that the connection was successful
    console.log('The database connection was successful.')

    let i = 0

    await defaultTools.forEach(async (defaultTool) => {
      const tool = await (new Tool({
        title: defaultTool.title,
        link: defaultTool.link,
        description: defaultTool.description,
        tags: defaultTool.tags
      }).save())

      //* Logs that the tool was created
      console.log(`The tool ${tool.title} was created.`)

      if (++i === defaultTools.length) {
        await mongoose.connection.close()
      }
    })
  }
})
