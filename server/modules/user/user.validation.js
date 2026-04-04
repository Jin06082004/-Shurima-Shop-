const Joi = require('joi');

const createUserSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
    address: Joi.string().min(5).required()
});

const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/),
    address: Joi.string().min(5)
}).min(1);

module.exports = { createUserSchema, updateUserSchema };
