import Joi from 'joi';

export const createBookingSchema = Joi.object({
    serviceId: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
});
