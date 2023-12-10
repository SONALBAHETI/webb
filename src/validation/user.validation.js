import Joi from "joi";
import { objectId } from "./custom.validation.js";

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUserDetailsFromOnboarding = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    occupation: Joi.string().required(),
    objective: Joi.string(),
    specialisations: Joi.array().items(),
    interests: Joi.array().items(), // TODO: Make one of them (specialisation/interest) required
  }),
};

export default {
  getUser,
  updateUserDetailsFromOnboarding,
};
