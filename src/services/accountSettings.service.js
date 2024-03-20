import httpStatus from "http-status";
import QuickReply, { QuickReplyType } from "../models/quickReply.model.js";

/**
 * Retrieves all the quick replies of the user
 * @param {string} userId - The ID of the user
 * @returns The list of quick replies
 */
const getQuickRepliesByUserId = async (userId) => {
  return await QuickReply.find({ user: userId }).sort({ updatedAt: -1 });
};

/**
 * Retrieves a single quick reply
 * @param {string} quickReplyId - The ID of the quick reply
 * @returns The quick reply
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

export default {
  getQuickRepliesByUserId,
  getQuickReplyById,
  createQuickReply,
  updateQuickReply,
  deleteQuickReply,
};

/**
 * @typedef {import("../models/quickReply.model").QuickReply} QuickReply
 */
