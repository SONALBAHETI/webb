import httpStatus from "http-status";
import GoogleCalendarAPIHandler from "../providers/google/googleCalendarApi.js";
import ApiError from "../utils/ApiError.js";
import { getUserById } from "./user.service.js";

/**
 * Authorize Google Calendar Sync and saves the access and refresh tokens in the user document
 * @param {string} userId - The ID of the user
 * @param {string} code - The code from the Google OAuth 2.0 flow
 * @returns {Promise<void>} - A promise that resolves when the authorization is complete
 */
const authorizeGoogleCalendarSync = async (userId, code) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  // exchange code for tokens
  const googleCalendarApiHandler = new GoogleCalendarAPIHandler(user);
  await googleCalendarApiHandler.generateTokens(code);
};

const isGoogleCredentialsAvailable = (user) => {
  if (
    !user.integrations.google.accessToken ||
    !user.integrations.google.refreshToken
  ) {
    return false;
  }
  return true;
};

/**
 * Verify google calendar sync for a user by checking user.integrations.google nested object
 * @param {string} userId - The ID of the user
 * @returns {Promise<boolean>} - A promise that resolves to true if the user has authorized Google Calendar Sync
 * and false otherwise
 */
const verifyGoogleCalendarSync = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!isGoogleCredentialsAvailable(user)) {
    return false;
  }
  const googleCalendarApiHandler = new GoogleCalendarAPIHandler(user);
  return await googleCalendarApiHandler.hasGrantedCalendarScopes();
};

/**
 * Remove google calendar sync by deleting user.integrations.google.accessToken and user.integrations.google.refreshToken
 * @param {string} userId - The ID of the user
 * @returns {Promise<void>} A promise that resolves when the Google Calendar Sync is removed
 */
const removeGoogleCalendarSync = async (userId) => {
  const user = await getUserById(userId);
  // validations
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!isGoogleCredentialsAvailable(user)) {
    throw new ApiError(httpStatus.NOT_FOUND, "Google Calendar is not synced");
  }

  // revoke google calendar tokens
  const googleCalendarApiHandler = new GoogleCalendarAPIHandler(user);
  await googleCalendarApiHandler.revokeCredentials();
};

export default {
  authorizeGoogleCalendarSync,
  verifyGoogleCalendarSync,
  removeGoogleCalendarSync,
};

/**
 * @typedef {import("../models/user.model.js").User} User
 * @typedef {import("../providers/google/googleCalendarApi.js").GoogleAuthCredentials} GoogleAuthCredentials
 */
