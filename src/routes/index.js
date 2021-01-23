//* Importing dependencies
const router = require('express').Router()
const OAuth = require('../util/oauth')

//* Handles the requests [GET] at '/'
router.get('/', async (req, res, next) => {
  //* If the user isn't logged on
  if (!req.user) {
    //* Creates a object that will be send to the user containing all OAuth links avaliable
    const auths = {}

    //* ForEach with all OAuth methods
    Object.keys(OAuth).forEach((key) => {
      //* Adds the AuthURL to the AuthObject
      auths[key] = OAuth[key].authURL(req.get('host'))
    })

    //* Sends it to the user
    res.status(401).send(auths).end()
  } else {
    //* Just shows a message instructing how to logout
    res.status(200).send(`Hi, you still logged on! If you want to logout, http://${req.get('host')}/logout`).end()
  }

  next()
})

//* Exporting the router to able others modules to use it
module.exports = router
