/** Environment Variables
 * COOKIES_SECRET
 * DB_AUTH (mongodb+srv://{USER}:{DB_PASSWORD}@{DB_HOST})
 * DB_NAME
 */

//* Importing and applying dotenv (a module that loads environment variables from a .env file into process.env)
require('dotenv').config()

//* Init the database globally
require('./util/database')()

//* Importing express() that is exported by ./server.js
// Building an app separately helps on tests
const app = require('./server')

//* Getting the given PORT or using 3000 as default (as requested by the challenge in Requirements#0)
// AWS, Google Cloud, Heroku, etc. may give a port to be used
const port = process.env.PORT || 3000

//* Starting to listen to the port
app.listen(port, () => {
  //* Logs in the console that the app started listening
  console.log(`Listening to :${port}`)
})
