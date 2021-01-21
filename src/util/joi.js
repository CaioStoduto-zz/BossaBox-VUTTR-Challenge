//* Importing dependencies
const Joi = require('joi')

//* Exporting the JOI Schema to able others modules to use it
module.exports = {
  Tool: Joi.object({
    title: Joi.string().required(),
    link: Joi.string().uri().required(),
    description: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required()
  }).options({ stripUnknown: true }) /* stripUnknown significa retirar do valor final variáveis que não foram listadas acima */
}
