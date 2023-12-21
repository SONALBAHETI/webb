import Joi from "joi";
import { objectId } from "./custom.validation.js";

const sendChatRequest = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    message: Joi.string().required(),
  }),
};

const acceptChatRequest = {
  params: Joi.object().keys({
    chatRequestId: Joi.string().custom(objectId),
  }),
};

export default {
  sendChatRequest,
  acceptChatRequest,
};
