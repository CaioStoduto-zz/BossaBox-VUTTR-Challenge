//* Importing dependencies
const cookieParser = require('cookie-parser')
const express = require('express')

//* Building app
const app = express()

//* Applying middlewares
// Helmet is used to set some headers that can help preventing some vulnerabilities (https://expressjs.com/en/advanced/best-practice-security.html#use-helmet)
app.use(require('helmet')())
// Implementing cookie-parser (a dependency that handles cookies and signedCookies)
app.use(cookieParser(process.env.COOKIES_SECRET)) // COOKIES_SECRET is the private key to signedCookies set in .env
// Implementing an handler to take care of requests with the body as json (as requested by the challenge in Requirements#3)
app.use(express.json())

//* Setting up routes
app.use('/', require('./routes/index'))
app.use('/oauth', require('./routes/oauth'))

//* Exporting the app to able others modules to use it
module.exports = app
