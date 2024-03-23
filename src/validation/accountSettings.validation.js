import Joi from "joi";
import {
  NotificationMode,
  notificationModeSettingSchema,
} from "../models/notificationSetting.model.js";

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

// update notification settings validation
const updateNotificationSettings = {
  body: Joi.object().keys({
    mode: Joi.string()
      .valid(...Object.values(NotificationMode))
      .required(),
    notification: Joi.string()
      .valid(
        ...Object.keys(notificationModeSettingSchema.paths).filter(
          (path) => path !== "_id"
        )
      )
      .required(),
    enabled: Joi.boolean().required(),
  }),
};

// authorize google calendar sync validation
const authorizeGoogleCalendarSync = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

export default {
  quickReplyById,
  updateQuickReply,
  createQuickReply,
  updateNotificationSettings,
  authorizeGoogleCalendarSync,
};
