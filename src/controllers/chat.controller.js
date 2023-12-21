import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import {
  getChatRequests,
  createChatRequest,
  updateChatRequest,
} from "../services/chat.service.js";

/**
 * Retrieve a list of pending chat requests for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns void
 */
const listChatRequests = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const chatRequests = await getChatRequests(userId);
  res.status(httpStatus.OK).send({ chatRequests: chatRequests });
});

/**
 * Sends a chat request to another user by creating a chat request document
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns void
 */
const sendChatRequest = catchAsync(async (req, res) => {
  const { userId: to, message } = req.body;
  const from = req.user._id;

  const chatRequest = await createChatRequest({ from, to, message });
  res.status(httpStatus.OK).send({ chatRequest: chatRequest.toJSON() });
});

const acceptChatRequest = catchAsync(async (req, res) => {
  const { chatRequestId } = req.params;
  const userId = req.user._id;
  const chatRequest = await updateChatRequest(chatRequestId, userId, {
    status: "accepted",
  });
  res.status(httpStatus.OK).send({ chatRequest: chatRequest.toJSON() });
});

export { listChatRequests, sendChatRequest, acceptChatRequest };
