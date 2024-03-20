import Joi from "joi";

// get or delete a single quick reply validation
const quickReplyById = {
  params: Joi.object().keys({
    quickReplyId: Joi.string().required(),
  }),
};

// update quick reply validation
const updateQuickReply = {
  params: Joi.object().keys({
    quickReplyId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    text: Joi.string().required(),
    shortcut: Joi.string().optional(),
  }),
};

// create quick reply validation
const createQuickReply = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    text: Joi.string().required(),
    shortcut: Joi.string().optional(),
  }),
};

export default {
  quickReplyById,
  updateQuickReply,
  createQuickReply,
};
