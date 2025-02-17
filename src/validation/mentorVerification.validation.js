import Joi from "joi";

const submitData = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    birthDate: Joi.date().required(),
    postalCode: Joi.string().required(),
    organization: Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
    }),
    status: Joi.string().required(),
  }),
};

export default {
  submitData,
};
