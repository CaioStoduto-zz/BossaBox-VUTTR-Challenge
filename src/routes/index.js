//* Importing dependencies
const router = require('express').Router()

//* Handles the requests [GET] at '/'
router.get('/', async (req, res) => {
  //* Just confirms that its working
  res.status(200).send('Hello world').end()
})

//* Exporting the router to able others modules to use it
module.exports = router
