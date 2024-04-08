import Joi from "joi";
import { objectId } from "./custom.validation.js";

const reportUser = {
  body: Joi.object({
    category: Joi.string().required(),
    reason: Joi.string().required(),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export default {
  reportUser,
}
