import Joi from "joi";

const docUpload = {
  file: Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string()
      .valid("application/pdf", "image/jpeg", "image/png", "image/jpg")
      .required(),
    size: Joi.number().max(1000000).required(),
  }).required(),
};

const getOrganizations = {
  query: Joi.object().keys({
    searchTerm: Joi.string().required(),
    orgSearchUrl: Joi.string().required(),
  }),
};

export default {
  docUpload,
  getOrganizations,
};
