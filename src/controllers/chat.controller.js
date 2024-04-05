import httpStatus from "http-status";
import {
  getChatRequests,
  createChatRequest,
  updateChatRequest,
  getChatRequestByIdAndPopulate,
  acceptChatRequestAndCreateGroupChannel,
} from "../services/chat.service.js";
import { ChatRequestStatus } from "../models/chatRequest.model.js";

/**
 * Get chat request by ID and populate from/to fields
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {ApiError} If chat request is not found
 */
const getChatRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const chatRequest = await getChatRequestByIdAndPopulate(id, [
    { path: "from", select: "name profile.picture" },
    { path: "to", select: "name" },
  ]);
  if (!chatRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Chat request not found");
  }
  if (chatRequest.to._id.toString() !== userId.toString()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You're unauthorized to perform this action"
    );
  }
  res.status(httpStatus.OK).send({ chatRequest: chatRequest.toJSON() });
};

/**
 * Retrieve a list of pending chat requests for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns void
 */
const listChatRequests = async (req, res) => {
  const userId = req.user.id;
  const chatRequests = await getChatRequests(userId);
  res.status(httpStatus.OK).send({ chatRequests });
};

/**
 * Sends a chat request to another user by creating a chat request document
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns void
 */
const sendChatRequest = async (req, res) => {
  const { userId: to, message } = req.body;
  const from = req.user.id;

  const chatRequest = await createChatRequest({ from, to, message });
  res.status(httpStatus.OK).send({ chatRequest });
};

/**
 * Accepts a chat request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const acceptChatRequest = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;
  const chatRequest = await acceptChatRequestAndCreateGroupChannel(id, userId);
  res.status(httpStatus.OK).send({ chatRequest });
};

/**
 * Rejects a chat request
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const rejectChatRequest = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;
  const chatRequest = await updateChatRequest(id, userId, {
    status: ChatRequestStatus.REJECTED,
  });
  res.status(httpStatus.OK).send({ chatRequest });
};

const getSendbirdCredentials = async (req, res) => {
  const sendbirdCredentials = await req.user.getSendbirdCredentials();
  res.status(httpStatus.OK).send(sendbirdCredentials);
};

export {
  getChatRequest,
  listChatRequests,
  sendChatRequest,
  acceptChatRequest,
  rejectChatRequest,
  getSendbirdCredentials,
};
