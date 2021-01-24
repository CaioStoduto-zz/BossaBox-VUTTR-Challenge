//* Importing dependencies
const cookieParser = require('cookie-parser')
const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

//* Building app
const app = express()

//* Applying middlewares
// Helmet is used to set some headers that can help preventing some vulnerabilities (https://expressjs.com/en/advanced/best-practice-security.html#use-helmet)
app.use(require('helmet')())
// Implementing cookie-parser (a dependency that handles cookies and signedCookies)
app.use(cookieParser(process.env.COOKIES_SECRET)) // COOKIES_SECRET is the private key to signedCookies set in .env
// Implementing an handler to take care of requests with the body as json (as requested by the challenge in Requirements#3)
app.use(express.json())

//* If it isn't a test
if (process.env.NODE_ENV !== 'test') {
  //* Set up a rate limit middleware
  app.use('*', (new (require('express-rate-limit'))({
    windowMs: 9e5 /* 15 minutes */,
    max: 100,
    message: 'Too many accounts created from this IP, please try again after 15 minutes.'
  })))
}

//* Middleware that parses the user found in the database
app.use('*', async (req, res, next) => {
  //* Gets the signed cookie 🍪 that contains the user authentication
  const authToken = req.signedCookies['auth-token']

  //* If the cookie 🍪 auth-token is different of null or undefined
  if (authToken) {
    //* Using try because jwt.verify() throws an error when the JWT is invalid
    try {
      //* Decripts the JWT
      const verified = jwt.verify(authToken, process.env.JWT_SECRET, { maxAge: '1d' })

      //* Using try because the mongoose throws an error when the ID syntax is invalid or when the database connection fails
      try {
        //* Finds the User by their ID, otherwise returns undefined
        req.user = await User.findById(verified._id) || undefined
      } catch (e) { /* Invalid UserID or database connection failed */ } // https://docs.mongodb.com/manual/reference/method/ObjectId/
    } catch (e) { /* Invalid JWT */ }
  }

  //* Takes it to the next middleware
  next()
})

//* Setting up routes
app.use('/', require('./routes/index'))
app.use('/logout', require('./routes/logout'))
app.use('/oauth', require('./routes/oauth'))

//* Exporting the app to able others modules to use it
module.exports = app
