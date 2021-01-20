//* Importing dependencies
const mongoose = require('mongoose')

//* Creates an Database Schema with the User model parameters
const UserSchema = new mongoose.Schema({
  loginIdentifiers: {
    type: Map,
    of: String,
    required: true
  },
  authorized: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true })

//* Exporting the model to able others modules to use it
module.exports = mongoose.model('User', UserSchema)
