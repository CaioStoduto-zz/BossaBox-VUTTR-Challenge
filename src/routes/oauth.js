//* Importing dependencies
const router = require('express').Router()
const { auth } = require('../util/misc')
const OAuth = require('../util/oauth')

//* [GET] /OAuth/*
Object.keys(OAuth).forEach((key) => {
  //* Sets the router to accept [GET] requests of each OAuth Service
  router.get(`/${key}`, async (req, res) => {
    //* Tries to get the identifier with the redirect parameters
    const loginID = await OAuth[key].getIdentifier(req.query)

    //* Shows the error that occured
    if (loginID.err !== undefined || !loginID.identifier) {
      return res.status(loginID.err.code).send(`${loginID.err.message}\n\nSomething went wrong, try again later, http://${req.get('host')}`).end()
    }

    //* Sets the OAuth Service used
    loginID.service = key
    //* Authorizate the user
    auth(req, res, loginID)
  })
})

//* Exporting the router to able others modules to use it
module.exports = router
