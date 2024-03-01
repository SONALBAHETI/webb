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

const getOrganizations = {
  query: Joi.object().keys({
    searchTerm: Joi.string().required(),
    orgSearchUrl: Joi.string().required(),
  }),
};

const docUpload = {
  file: Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string()
      .valid("application/pdf", "image/jpeg", "image/png", "image/jpg")
      .required(),
    size: Joi.number().max(1000000).required(),
  }).required(),
};

export default {
  submitData,
  getOrganizations,
  docUpload,
};
