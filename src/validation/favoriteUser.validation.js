import Joi from "joi";

const createFavoriteUser = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    chatChannelUrl: Joi.string().required(),
  }),
};

export default {
  createFavoriteUser,
};
