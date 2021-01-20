//* Importing dependencies
const router = require('express').Router()

//* Handles the requests [GET] at '/logout'
router.get('/', async (req, res) => {
  //* Clears the cookie auth-token logging the user out
  res.clearCookie('auth-token')
  //* Sends a message just to confirm that they're logged out
  return res.status(200).send('Logged out').end()
})

//* Exporting the router to able others modules to use it
module.exports = router
