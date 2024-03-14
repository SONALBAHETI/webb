import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from "./user.service.js";
import { generateAuthTokens, verifyToken } from "./token.service.js";
import { tokenTypes } from "../config/tokens.js";
import Token from "../models/token.model.js";
import User from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import config from "../config/config.js";
import logger from "../config/logger.js";

/**
 * Authenticates a user with their email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @return {Promise<User>} The authenticated user.
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect email or password");
  }
  return user;
};

/**
 * Verifies a Google ID token.
 *
 * @param {string} idToken - The ID token to be verified.
 * @return The verified ticket object.
 */
const verifyGoogleIdToken = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.providers.google.clientId,
  });
  return ticket;
};

/**
 * Function to get or create a user using Google authentication.
 *
 * @param {string} idToken - The ID token from Google authentication
 * @throws {ApiError} If some information is missing from the ID token
 * @return {Promise<User>} The existing or newly created user
 */
const getOrCreateUserWithGoogle = async (idToken) => {
  const ticket = await verifyGoogleIdToken(idToken);
  const payload = ticket.getPayload();
  const userId = ticket.getUserId();
  if (!userId || !payload || !payload.email) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while logging in with Google"
    );
  }
  const { name, email, given_name, family_name, picture } = payload;
  // check for existing user
  const user = await getUserByEmail(email);
  if (user) {
    return user;
  }
  // create a new user if it doesn't exist
  const newUser = await createUser({
    name,
    email,
    profile: {
      firstName: given_name,
      lastName: family_name,
      picture,
    },
    isEmailVerified: true,
    integrations: {
      google: {
        userId,
      },
    },
  });
  return newUser;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.findOneAndDelete({ token: refreshTokenDoc.token });
    const tokens = await generateAuthTokens(user.id);
    return tokens;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Session Not found");
  }
  await Token.findOneAndDelete({ token: refreshTokenDoc.token });
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error("User not found");
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await updateUser(user.id, { accountStatus: { isEmailVerified: true } });
  } catch (error) {
    logger.error("Error verifying email", error);
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 */
const changePassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error("User not found");
    }
    await updateUser(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

export {
  loginUserWithEmailAndPassword,
  refreshAuth,
  logout,
  verifyGoogleIdToken,
  getOrCreateUserWithGoogle,
  verifyEmail,
  changePassword,
};
