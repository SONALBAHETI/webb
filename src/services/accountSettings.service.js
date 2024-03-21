import httpStatus from "http-status";
import QuickReply, { QuickReplyType } from "../models/quickReply.model.js";
import NotificationSetting from "../models/notificationSetting.model.js";
import ApiError from "../utils/ApiError.js";
import deepMerge from "../utils/deepMerge.js";

/**
 * Retrieves all the quick replies of the user
 * @param {string} userId - The ID of the user
 */
const getQuickRepliesByUserId = async (userId) => {
  return await QuickReply.find({ user: userId }).sort({ updatedAt: -1 });
};

/**
 * Retrieves a single quick reply
 * @param {string} quickReplyId - The ID of the quick reply
 */
const getQuickReplyById = (quickReplyId) => {
  return QuickReply.findById(quickReplyId);
};

/**
 * Creates a new quick reply
 * @param {string} userId - The ID of the user
 * @param {QuickReply} quickReply - The quick reply to be created
 * @returns {Promise<QuickReply>} The created quick reply
 */
const createQuickReply = async (userId, quickReply) => {
  const newQuickReply = new QuickReply({
    user: userId,
    type: QuickReplyType.CUSTOM,
    ...quickReply,
  });
  return await newQuickReply.save();
};

/**
 * Updates a quick reply
 * @param {string} quickReplyId The ID of the quick reply
 * @param {Partial<QuickReply>} updateBody The update body of the quick reply
 * @returns {Promise<QuickReply>} The updated quick reply
 */
const updateQuickReply = async (quickReplyId, updateBody) => {
  const quickReply = await QuickReply.findById(quickReplyId);
  if (!quickReply) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quick reply not found");
  }
  Object.assign(quickReply, updateBody);
  await quickReply.save();
  return quickReply;
};

/**
 * Deletes a quick reply
 * @param {string} quickReplyId The ID of the quick reply
 */
const deleteQuickReply = async (quickReplyId) => {
  const quickReply = await QuickReply.findById(quickReplyId);
  if (!quickReply) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quick reply not found");
  }
  await QuickReply.deleteOne({ _id: quickReplyId });
};

/**
 * Retrieves all the notification settings of the user.
 * If the notification settings do not exist, it creates them.
 * @param {string} userId - The ID of the user
 * @returns {Promise<NotificationSetting>} The notification settings query
 */
const getNotificationSettings = async (userId) => {
  let notificationSettings = await NotificationSetting.findOne({ user: userId });
  if (!notificationSettings) {
    notificationSettings = await createDefaultNotificationSettings(userId);
  }
  return notificationSettings;
};

/**
 * Create default notification settings of a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<NotificationSetting>} The created notification settings
 */
const createDefaultNotificationSettings = async (userId) => {
  const notificationSettings = new NotificationSetting({
    user: userId,
    inAppNotifications: {},
    emailNotifications: {},
  });
  await notificationSettings.save();
  return notificationSettings;
};

/**
 * Update notification settings of a user
 * @param {string} userId - The ID of the user
 * @param {Partial<NotificationSetting>} updateBody - The update body of the notification settings
 * @returns {Promise<NotificationSetting>} The updated notification settings
 */
const updateNotificationSettings = async (userId, updateBody) => {
  let notificationSettings = await getNotificationSettings(userId);
  if (!notificationSettings) {
    notificationSettings = await createDefaultNotificationSettings(userId);
  }
  deepMerge(notificationSettings, updateBody);
  await notificationSettings.save();
  return notificationSettings;
};

export default {
  getQuickRepliesByUserId,
  getQuickReplyById,
  createQuickReply,
  updateQuickReply,
  deleteQuickReply,
  getNotificationSettings,
  updateNotificationSettings,
  createDefaultNotificationSettings,
};

/**
 * @typedef {import("../models/quickReply.model.js").QuickReply} QuickReply
 * @typedef {import("../models/notificationSetting.model.js").NotificationSetting} NotificationSetting
 */
