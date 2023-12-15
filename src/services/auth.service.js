import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import { getUserByEmail, getUserById } from "./user.service.js";
import { generateAuthTokens, verifyToken } from "./token.service.js";
import { tokenTypes } from "../config/tokens.js";
import Token from "../models/token.model.js";

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
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
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
    const tokens = await generateAuthTokens(user);
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

export { loginUserWithEmailAndPassword, refreshAuth, logout };
