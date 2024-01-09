import Joi from "joi";
import { objectId } from "./custom.validation.js";

const sendChatRequest = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    message: Joi.string().required(),
  }),
};

const acceptChatRequest = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const rejectChatRequest = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const getChatRequest = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export default {
  sendChatRequest,
  acceptChatRequest,
  rejectChatRequest,
  getChatRequest,
};
