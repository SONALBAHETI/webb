import Joi from "joi";

const submitData = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    birthDate: Joi.date().required(),
    organization: Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
    }).required(),
    email2: Joi.string().email(),
    phoneNumber: Joi.string(),
  }),
};

export default {
  submitData,
};
