const Joi = require('joi');

const createServiceSchema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string()
        .valid('venue', 'hotel', 'caterer', 'cameraman', 'dj', 'decorator', 'other')
        .required(),
    pricePerDay: Joi.number().min(0).required(),
    description: Joi.string().required(),
    availabilityDates: Joi.string().required(),
    contactDetails: Joi.string().required(),
    location: Joi.string().required(),
});

const updateServiceSchema = Joi.object({
    title: Joi.string().optional(),
    category: Joi.string()
        .valid('venue', 'hotel', 'caterer', 'cameraman', 'dj', 'decorator', 'other')
        .optional(),
    pricePerDay: Joi.number().min(0).optional(),
    description: Joi.string().optional(),
    availabilityDates: Joi.string().optional(),
    contactDetails: Joi.string().optional(),
    location: Joi.string().optional(),
});

module.exports = { createServiceSchema, updateServiceSchema };
