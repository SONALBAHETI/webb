import SendbirdUserHandler from "../providers/sendbird/modules/chat/user.js";
import { getUserById, updateUser } from "./user.service.js";
import ChatRequest from "../models/chatRequest.model.js";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import deepMerge from "../utils/deepMerge.js";

const sendbirdUserHandler = new SendbirdUserHandler(
  config.sendBird.appId,
  config.sendBird.apiToken
);

/**
 * Retrieves pending chat requests for a specified user.
 *
 * @param {string} userId - The ID of the user for whom to retrieve pending chat requests.
 * @returns A promise that resolves to an array of pending chat requests with populated 'from' and 'to' fields.
 */
const getChatRequests = async (userId) => {
  return ChatRequest.find({ to: userId, status: "pending" })
    .populate([
      { path: "from", select: "name profile.picture" },
      { path: "to", select: "name" },
    ])
    .sort({ updatedAt: -1 });
};

const getChatRequestById = async (chatId) => {
  return ChatRequest.findById(chatId);
};

const getChatRequestByIdAndPopulate = async (chatId, populate) => {
  return ChatRequest.findById(chatId).populate(populate);
};

const createChatRequest = async (chatBody) => {
  // TODO: Validate the user ids in the chat request (from, to)
  // Create a new chat request
  return ChatRequest.create(chatBody);
};

/**
 * Updates a chat request with the provided chatId, userId, and updateBody.
 *
 * @param {string} chatId - The ID of the chat request
 * @param {string} userId - The ID of the user
 * @param {object} updateBody - The updated chat request body
 * @return A promise that resolves to the saved chat request
 */
const updateChatRequest = async (chatId, userId, updateBody) => {
  const chatRequest = await getChatRequestById(chatId);
  if (!chatRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Chat request not found");
  }
  if (chatRequest.to.toString() !== userId.toString()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You're unauthorized to perform this action"
    );
  }
  deepMerge(chatRequest, updateBody);
  return await chatRequest.save();
};

/**
 * Enable chat and calls for a user by creating a new Sendbird user if not already created,
 * associating the Sendbird user ID with the user in the database, and returning the updated user object.
 *
 * @param {string} userId - The ID of the user for whom chat and calls are being enabled.
 * @returns A promise that resolves to the updated user object with Sendbird user ID and access token.
 */
const enableChatAndCallsForUser = async (userId) => {
  // Create a new Sendbird user
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.getSendbirdCredentials().userId) {
    return user;
  }

  // Create a new user in sendbird with a unique user_id
  const sendbirdUserId = uuidv4();
  const sendbirdUser = await sendbirdUserHandler.createUser({
    user_id: sendbirdUserId,
    nickname: user.name,
    issue_access_token: true,
    profile_url: user.profile?.picture || "",
  });

  // Add sendbird user id reference in the User model in database
  const updatedUser = await updateUser(userId, {
    integrations: {
      sendbird: {
        userId: sendbirdUser.user_id,
        accessToken: sendbirdUser.access_token,
      },
    },
  });
  return updatedUser;
};

export {
  getChatRequestById,
  getChatRequestByIdAndPopulate,
  updateChatRequest,
  createChatRequest,
  enableChatAndCallsForUser,
  getChatRequests,
};
