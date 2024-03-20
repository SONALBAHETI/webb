import httpStatus from "http-status";
import accountSettingsService from "../services/accountSettings.service.js";

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
}

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
  console.log(req.params, req.body);
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

export default {
  getQuickReplies,
  getQuickReplyById,
  createQuickReply,
  updateQuickReply,
  deleteQuickReply,
}
