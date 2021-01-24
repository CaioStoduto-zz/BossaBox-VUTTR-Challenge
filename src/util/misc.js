//* Importing dependencies
const jwt = require('jsonwebtoken')
const User = require('../models/user')

//* Those functions are here and not where they are used so it can be tested

/**
 * Authorizates the user using cookies
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {String} loginID the login identification obtained when the user logged in
 */
async function auth (req, res, loginID) {
  //* Function that will find or create a new user depending if the identifier has been founded
  const userResult = await findOrCreateUser(loginID)

  //* Sets the status of the result as the status output of the previous function
  res.status(userResult.status)

  /**
   * Creates the cookie and sign it to the user
   */
  function cookingCookie () {
    //* Creates a JWT containing the user authentication
    // _id = Database doc id (auto-generated)
    // it expires after 2 days because isn't recommended to mantein the user logged forever (https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#Session_fixation)
    const token = jwt.sign({ _id: userResult.user._id }, process.env.JWT_SECRET, { expiresIn: '2d' })
    //* Sets the cookie
    // 8640000 = 2 days
    res.cookie('auth-token', token, {
      signed: true,
      maxAge: 86400000,
      httpOnly: true
    })
  }

  //* Just to show different messages depending if the user is new
  switch (userResult.status) {
    //* The user isn't new
    case 200: {
      cookingCookie()
      res.send("You're logged in.").end()
      return
    }

    //* The user is new
    case 201: {
      cookingCookie()
      res.send("You're a new user, wecolme!").end()
      return
    }

    //* If an error occured
    default: {
      //* Shows the error message to the user
      console.error(userResult)
      res.status(500).send('Something went wrong, try again later.').end()
    }
  }
}

/**
 * Search for the user or creates one on the database
 * @param {object} param0 the LoginID
 * @param {String} param0.identifier string that identifies the user
 * @param {String} param0.service service used to authenticate the user
 */
async function findOrCreateUser ({ identifier, service }) {
  //* Tries to find the user using the identifier
  let user = await User.findOne({ loginIdentifiers: { [service]: identifier } }).catch((e) => {
    //* If an error occurs, returns the error
    return {
      status: 500,
      err_message: e.reason
    }
  })

  //* If the user exists
  if (user) {
    return { status: 200, user }
  } else {
    //* Else creates a new user
    user = await new User({
      loginIdentifiers: {
        [service]: identifier
      }
    }).save()

    return { status: 201, user }
  }
}

//* Exporting the functions to able others modules to use it
module.exports = {
  auth,
  findOrCreateUser
}
