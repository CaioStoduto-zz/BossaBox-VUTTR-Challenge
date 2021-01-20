//* Importing dependencies
const router = require('express').Router()
const OAuth = require('../util/oauth')

Object.keys(OAuth).forEach((key) => {
  router.get(`/${key}`, async (req, res) => {
    const loginID = await OAuth[key].getLoginIdentifier(req.query)

    if (loginID.err === undefined && loginID.identifier) {
      return res.status(200).send(`Your ID on ${key} is ${loginID.identifier}`).end()
    } else {
      return res.status(loginID.err.code).send(`${loginID.err.message}\n\nSomething went wrong, try again later, http://${req.get('host')}`).end()
    }
  })
})

//* Exporting the router to able others modules to use it
module.exports = router
