//* Importing dependencies
const router = require('express').Router()
const OAuth = require('../util/oauth')

//* Gets all the OAuth methods avaliable
Object.keys(OAuth).forEach((key) => {
  //* Sets the router to accept [GET] requests of each OAuth Service
  router.get(`/${key}`, async (req, res) => {
    //* Tries to get the identifier with the redirect parameters
    const loginID = await OAuth[key].getIdentifier(req.query)

    //* If it successfully gets the ID
    if (loginID.err === undefined && loginID.identifier) {
      return res.status(200).send(`Your ID on ${key} is ${loginID.identifier}`).end()
    } else {
      //* Shows the error that occured
      return res.status(loginID.err.code).send(`${loginID.err.message}\n\nSomething went wrong, try again later, http://${req.get('host')}`).end()
    }
  })
})

//* Exporting the router to able others modules to use it
module.exports = router
