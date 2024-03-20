import Joi from "joi";

const getNotification = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(15),
  }),
};

export default {
  getNotification,
};
