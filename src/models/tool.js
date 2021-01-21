//* Importing dependencies
const mongoose = require('mongoose')

//* Creates an Database Schema with the User model parameters
const ToolSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: [],
    required: true
  }
}, { timestamps: true })

//* Exporting the model to able others modules to use it
module.exports = mongoose.model('Tool', ToolSchema)
