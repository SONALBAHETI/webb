import Joi from "joi";

const sendMessage = {
  body: Joi.object().keys({
    message: Joi.string().required(),
  }),
};

const retrieveRunStatus = {
  params: Joi.object().keys({
    id: Joi.string().required().description("Run ID"),
  }),
};

export default {
  sendMessage,
  retrieveRunStatus,
};
