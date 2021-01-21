//* Importing dependencies
const router = require('express').Router()
const Tool = require('../models/tool')
const joi = require('../utils/joi')

//* Middleware that blocks unauthorized users
router.use('*', (req, res, next) => {
  //* If the user isn't authenticated
  if (req.user === undefined) {
    return res.status(401).send(`You aren't logged in.\n\nPlease authenticate using: "http://${req.get('host')}"\n\nWarning: the authentication uses cookies 🍪 (auth-token)`).end()
  }

  //* If the user isn't authorized
  if (req.user.authorized !== true) {
    return res.status(401).send("You're logged in, but you aren't authorized.").end()
  }

  //* Moves to the next request handler
  next()
})

//* Handles the requests [GET] at '/tools'
router.get('/', async (req, res) => {
  //* Query search by tag
  const query = req.query.tag ? { tags: { $all: req.query.tag } } : {}

  //* Expected error, can occur an error on database connection
  try {
    //* Sends to the user an map with all tools
    return res.status(200).contentType('application/json').json(await Tool.find(query)).end()
  } catch (e) {
    //* The database connection failed
    return res.status(500).send(e.reason).end()
  }
})

//* Handles the requests [POST] at '/tools'
router.post('/', async (req, res) => {
  //* If the header 'Content-Type' isn't 'application/json'
  if (!req.is('application/json')) {
    return res.status(400).send("The header 'Content-Type' needs to be 'application/json.'").end()
  }

  //* Uses JOI to validate the user input
  const { error, value } = joi.Tool.validate(req.body)

  //* If JOI validation fails, ends informimg the user
  if (error) return res.status(400).send(error.message).end()

  //* Creates a new tool (in the dabatase) based on the user input
  const tool = await new Tool({
    title: value.title,
    link: value.link,
    description: value.description,
    tags: value.tags
  }).save()

  //* Returns the created tool to the user
  return res.status(201).contentType('application/json').json(tool).end()
})

//* Handles the requests [DELETE] at '/tools:id'
router.delete('/:id', async (req, res) => {
  //* Expected error, the id given by the user can be invalid or occur an error on database connection
  try {
    //* Tries to delete the doc by the id
    await Tool.findByIdAndDelete(req.params.id)
    //* Returns the result to the user
    return res.status(204).end()
  } catch (e) {
    //* If the error is related to ObjectID invalid
    if (e.reason.toString().startsWith('Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')) {
      return res.status(400).send('The Tool ID is invalid.').end()
    } else {
      //* The database connection failed
      return res.status(500).send(e.reason).end()
    }
  }
})

//* Exporting the router to able others modules to use it
module.exports = router
