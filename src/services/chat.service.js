import SendbirdUserHandler from "../providers/sendbird/modules/user.js";
import { updateUser } from "./user.service.js";
import User from "../models/user.model.js";
import ChatRequest from "../models/chatRequest.model.js";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const sendbirdUserHandler = new SendbirdUserHandler(
  config.sendBird.appId,
  config.sendBird.apiToken
);

const getChatRequests = async (userId) => {
  return ChatRequest.find({ to: userId, status: "pending" }).populate([
    { path: "from", select: "name" },
    { path: "to", select: "name" },
  ]);
};

const getChatRequestById = async (chatId) => {
  return ChatRequest.findById(chatId);
};

const createChatRequest = async (chatBody) => {
  // TODO: Validate the user ids in the chat request (from, to)
  // Create a new chat request
  return ChatRequest.create(chatBody);
};

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
  Object.assign(chatRequest, updateBody);
  return await chatRequest.save();
};

const enableChatForUser = async (userId) => {
  // Create a new Sendbird user
  const user = await User.findById(userId).select("name email sendbirdUserId");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.sendbirdUserId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User already has enabled the chat"
    );
  }

  // Create a new user in sendbird with a unique user_id
  const sendbirdUserId = uuidv4();
  const sendbirdUser = await sendbirdUserHandler.createUser({
    user_id: sendbirdUserId,
    nickname: user.name,
    issue_access_token: true,
    profile_url: "",
  });
  // TODO: save access token from sendbird?

  // Add sendbird user id reference in the User model in database
  const updatedUser = await updateUser(userId, {
    sendbirdUserId: sendbirdUser.user_id,
  });
  console.log("updatedUser", updatedUser);
  return updatedUser;
};

export {
  getChatRequestById,
  updateChatRequest,
  createChatRequest,
  enableChatForUser,
  getChatRequests,
};
