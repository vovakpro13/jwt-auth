const Joi = require('joi');

const { regexp } = require('../constants');

module.exports = {
    chekRegistrationBody: Joi.object().keys({
        name: Joi.string().min(3).max(200).required(),
        email: Joi.string().regex(regexp.EMAIL).required(),
        password: Joi.string().regex(regexp.PASSWORD).max(256).required()
    }),
    chekLoginBody: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    }),
}