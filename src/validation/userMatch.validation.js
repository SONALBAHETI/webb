import Joi from "joi";
import { objectId } from "./custom.validation.js";

const getUserMatch = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export default {
  getUserMatch,
};
