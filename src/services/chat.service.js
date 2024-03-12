import { getUserById, getUsersById, updateUser } from "./user.service.js";
import ChatRequest, { ChatRequestStatus } from "../models/chatRequest.model.js";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import deepMerge from "../utils/deepMerge.js";
import {
  SendbirdGroupChannelHandler,
  SendbirdUserHandler,
  SendbirdMessageHandler,
} from "../providers/sendbird/modules/chat/index.js";

/**
 * @typedef {import("../providers/sendbird/modules/chat/groupChannels.js").CreateGroupChannelOptions} CreateGroupChannelOptions
 * @typedef {import("../providers/sendbird/modules/chat/groupChannels.js").GroupChannel} GroupChannel
 * @typedef {import("../models/chatRequest.model.js").ChatRequest} ChatRequest
 */

const { appId, apiToken } = config.sendBird;

const sendbirdUserHandler = new SendbirdUserHandler(appId, apiToken);
const sendbirdGroupChannelHandler = new SendbirdGroupChannelHandler(
  appId,
  apiToken
);
const sendbirdMessageHandler = new SendbirdMessageHandler(appId, apiToken);

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

const getChatRequestById = (chatId) => {
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
 * Accepts a chat request and creates a group channel in Sendbird.
 * @param {string} chatRequestId - The ID of the chat request.
 * @param {string} receiverId - The ID of the receiver of the chat request.
 * @throws {ApiError} If the chat request is not found or the user is not authorized.
 * @returns {Promise<ChatRequest>} The updated chat request.
 */
const acceptChatRequestAndCreateGroupChannel = async (
  chatRequestId,
  receiverId
) => {
  // retrieve chat request
  const chatRequest = await getChatRequestById(chatRequestId);
  // validate if chat request exists
  if (!chatRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Chat request not found");
  }
  // validate that chat request is sent to the receiverId
  if (chatRequest.to.toString() !== receiverId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "User unauthorized to perform this action"
    );
  }
  const userIds = [chatRequest.from.toString(), chatRequest.to.toString()];
  // create group channel in sendbird
  const groupChannel = await createGroupChannel(userIds, {
    initialMessage: chatRequest.message,
  });
  // update chat request status to accepted
  chatRequest.status = ChatRequestStatus.ACCEPTED;
  chatRequest.channelUrl = groupChannel.channel_url;
  // save updates
  return await chatRequest.save();
};

/**
 * Sends an initial text message to a newly created group channel.
 * @param {string} channelUrl - The URL of the newly created group channel.
 * @param {string} senderId - The ID of the sender.
 * @param {string} message - The message to send.
 * @returns {Promise<import("../providers/sendbird/modules/chat/messages.js").SendbirdTextMessage>} The sent text message.
 */
const sendInitialGroupChannelTextMessage = async (
  channelUrl,
  senderId,
  message
) => {
  return await sendbirdMessageHandler.sendTextMessage({
    channelUrl,
    userId: senderId,
    message,
  });
};

/**
 * Updates a chat request with the provided chatId, userId, and updateBody.
 *
 * @param {string} chatId - The ID of the chat request
 * @param {string} userId - The ID of the user
 * @param {Partial<ChatRequest>} updateBody - The updated chat request body
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
 * Creates a group channel in Sendbird.
 *
 * @param {string[]} user_ids - An array of user IDs.
 * @param {CreateGroupChannelOptions & { initialMessage?: string }} [options] - Options for creating the group channel.
 * @throws {ApiError} If the API request fails.
 * @returns {Promise<GroupChannel>} The created group channel.
 */
const createGroupChannel = async (userIds, options = {}) => {
  const { initialMessage, ...channelOptions } = options;
  const users = await getUsersById(userIds).select("integrations.sendbird");
  if (!users || !users.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "Users not found");
  }
  const sendbirdIds = users.map((user) => user.getSendbirdId());
  if (sendbirdIds.length < 2) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Not enough users to create a group channel"
    );
  }
  const groupChannel = await sendbirdGroupChannelHandler.createGroupChannel(
    sendbirdIds,
    channelOptions
  );
  if (initialMessage) {
    const senderId = users
      .find((user) => user.id === userIds[0])
      ?.getSendbirdId();
    if (!senderId) {
      throw new ApiError(httpStatus.NOT_FOUND, "Sender not found");
    }
    await sendInitialGroupChannelTextMessage(
      groupChannel.channel_url,
      senderId,
      initialMessage
    );
  }
  return groupChannel;
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
  createGroupChannel,
  acceptChatRequestAndCreateGroupChannel,
};
