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
  const googleCalendarApiHandler = GoogleCalendarAPIHandler.init();
  const tokens = await googleCalendarApiHandler.getTokens(code);

  // save access tokens in user model
  user.integrations.google.accessToken = tokens.access_token;
  user.integrations.google.refreshToken = tokens.refresh_token;
  const isCalendarScopesGranted = await verifyGoogleCalendarScopes(user);
  if (!isCalendarScopesGranted) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Please select google calendar permissions when connecting to your google account"
    );
  }
  await user.save();
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
  return await verifyGoogleCalendarScopes(user);
};

/**
 * Verify google calendar scopes for a user
 * @param {User} user
 * @returns {Promise<boolean>} A promise that resolves to true if the user has granted calendar scopes
 * and false otherwise
 */
const verifyGoogleCalendarScopes = async (user) => {
  const googleCalendarApiHandler = GoogleCalendarAPIHandler.init();
  googleCalendarApiHandler.setTokens(createTokens(user));
  return await googleCalendarApiHandler.hasGrantedCalendarScopes();
};

/**
 * @param {User} user
 * @returns {GoogleAuthCredentials} GoogleAuthCredentials
 */
const createTokens = (user) => {
  return {
    access_token: user.integrations.google.accessToken,
    refresh_token: user.integrations.google.refreshToken,
  };
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
  const googleCalendarApiHandler = GoogleCalendarAPIHandler.init();
  googleCalendarApiHandler.setTokens(createTokens(user));
  googleCalendarApiHandler.revokeCredentials();

  // delete google calendar tokens from DB
  user.integrations.google.accessToken = null;
  user.integrations.google.refreshToken = null;
  await user.save();
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
