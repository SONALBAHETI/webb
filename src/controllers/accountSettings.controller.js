import httpStatus from "http-status";
import accountSettingsService from "../services/accountSettings.service.js";
import calendarSyncService from "../services/calendarSync.service.js";

/**
 * Retrieves all quick replies of a user
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends quick replies in the response
 */
const getQuickReplies = async (req, res) => {
  const quickReplies = await accountSettingsService.getQuickRepliesByUserId(
    req.user.id
  );
  res.status(httpStatus.OK).send({ quickReplies });
};

/**
 * Retrieves a single quick reply.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends the quick reply in the response
 */
const getQuickReplyById = async (req, res) => {
  const quickReply = await accountSettingsService.getQuickReplyById(
    req.params.quickReplyId
  );
  res.status(httpStatus.OK).send({ quickReply });
};

/**
 * Creates a new quick reply
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends the created quick reply in the response
 */
const createQuickReply = async (req, res) => {
  const quickReply = await accountSettingsService.createQuickReply(
    req.user.id,
    req.body
  );
  res.status(httpStatus.CREATED).send({ quickReply });
};

/**
 * Updates a quick reply
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends the updated quick reply in the response
 */
const updateQuickReply = async (req, res) => {
  const quickReply = await accountSettingsService.updateQuickReply(
    req.params.quickReplyId,
    req.body
  );
  res.status(httpStatus.OK).send({ quickReply });
};

/**
 * Deletes a quick reply
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends an OK status in the response
 */
const deleteQuickReply = async (req, res) => {
  await accountSettingsService.deleteQuickReply(req.params.quickReplyId);
  res.status(httpStatus.OK).send({ success: true });
};

/**
 * Get notification settings of a user
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends notification settings in the response
 */
const getNotificationSettings = async (req, res) => {
  const notificationSettings =
    await accountSettingsService.getNotificationSettings(req.user.id);
  res.status(httpStatus.OK).send({ notificationSettings });
};

/**
 * Update notification settings of a user
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends updated notification settings in the response
 */
const updateNotificationSettings = async (req, res) => {
  const { mode, notification, enabled } = req.body;
  const updateBody = {
    [mode]: {
      [notification]: enabled,
    },
  };
  const notificationSettings =
    await accountSettingsService.updateNotificationSettings(
      req.user.id,
      updateBody
    );
  res.status(httpStatus.OK).send({ notificationSettings });
};

/**
 * Deactivate a user's account
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends an OK status in the response
 */
const deactivateAccount = async (req, res) => {
  await accountSettingsService.deactivateAccount(req.user.id);
  res.status(httpStatus.OK).send({ success: true });
};

/**
 * Schedule account deletion in 14 days
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends an OK status in the response
 */
const scheduleAccountDeletion = async (req, res) => {
  const userId = req.user.id;
  // Schedule account deletion in 14 days
  await accountSettingsService.scheduleAccountDeletion(userId, 14);
  res.status(httpStatus.OK).send({ success: true });
};

/**
 * Authorize Google Calendar Sync
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends an OK status in the response
 */
const authorizeGoogleCalendarSync = async (req, res) => {
  await calendarSyncService.authorizeGoogleCalendarSync(
    req.user.id,
    req.body.code
  );
  res.status(httpStatus.OK).send({ success: true });
};

/**
 * Verify google calendar sync
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends an OK status in the response
 */
const verifyGoogleCalendarSync = async (req, res) => {
  const authorized = await calendarSyncService.verifyGoogleCalendarSync(req.user.id);
  res.status(httpStatus.OK).send({ authorized });
};

/**
 * Remove google calendar sync
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return {Promise<void>} Sends an OK status in the response
 */
const removeGoogleCalendarSync = async (req, res) => {
  await calendarSyncService.removeGoogleCalendarSync(req.user.id);
  res.status(httpStatus.OK).send({ success: true });
};

export default {
  getQuickReplies,
  getQuickReplyById,
  createQuickReply,
  updateQuickReply,
  deleteQuickReply,
  getNotificationSettings,
  updateNotificationSettings,
  deactivateAccount,
  scheduleAccountDeletion,
  authorizeGoogleCalendarSync,
  verifyGoogleCalendarSync,
  removeGoogleCalendarSync,
};
