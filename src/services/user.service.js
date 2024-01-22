import httpStatus from "http-status";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { Document } from "mongoose";

/**
 * Create a user
 * @param {Object} userBody
 * @throws {ApiError} If email already exists
 * @returns {Promise<Document<User>>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.CONFLICT, "Email is already taken!");
  }
  return User.create(userBody);
};

/**
 * Get user by email
 * @param {string} email
 * @return {Promise<Document<User> | null>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @return {Promise<Document<User> | null>} A promise that resolves to the user document.
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Updates a user's information.
 *
 * @param {string} userId - The ID of the user to be updated.
 * @param {Object} updateBody - The object containing the updated user information.
 * @throws {ApiError} If the user is not found or if the email is already taken.
 * @return The updated user object.
 */
const updateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.CONFLICT, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Updates the OpenAI thread ID for a user.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {string} threadId - The new OpenAI thread ID.
 * @throws {ApiError} If userId or threadId is missing.
 * @returns The updated user object.
 */
const updateOpenAIThreadId = async (userId, threadId) => {
  if (!userId || !threadId) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Missing userId or threadId"
    );
  }
  const user = await updateUser(userId, {
    integrations: {
      openai: {
        threadId: threadId,
      },
    },
  });
  return user;
};

export {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateOpenAIThreadId,
};
