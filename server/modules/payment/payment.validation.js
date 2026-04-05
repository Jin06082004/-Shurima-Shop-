const Joi = require('joi');

const createPaymentSchema = Joi.object({
    orderId: Joi.string().required(),
    method: Joi.string().valid('cod').required()
});

const updatePaymentStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'paid', 'failed', 'cancelled').required()
});

module.exports = { createPaymentSchema, updatePaymentStatusSchema };
