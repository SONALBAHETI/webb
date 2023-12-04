import jwt from "jsonwebtoken";
import moment from "moment";
import Token from "../models/token.model.js";
import { getUserByEmail } from "../services/user.service.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import config from "../config/config.js";
import { tokenTypes } from "../config/tokens.js";

/**
 * Generates a token for the given user ID, expiration time, and type.
 *
 * @param {string} userId - The ID of the user.
 * @param {moment.Moment} expires - The expiration time of the token.
 * @param {string} type - The type of the token.
 * @param {string} [secret=config.jwt.secret] - The secret used to sign the token (default value is taken from the config).
 * @return {string} The generated token.
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Saves a token to the database.
 *
 * @param {string} token - The token to be saved.
 * @param {string} userId - The ID of the user associated with the token.
 * @param {Date} expires - The expiration date of the token.
 * @param {string} type - The type of the token.
 * @param {boolean} [blacklisted=false] - Indicates whether the token is blacklisted. Default is false.
 * @return {Object} - The saved token document.
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verifies a token of a given type. Throws an error if the token is invalid.
 *
 * @param {string} token - The token to be verified.
 * @param {string} type - The type of token.
 * @return {Promise<Token>} The token document if it is valid.
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

/**
 * Generates an authentication token for the given user.
 *
 * @param {Object} user - The user object.
 * @return {Object} An object containing access and refresh tokens.
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );

  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate a reset password token for a user with the given email.
 *
 * @param {string} email - The email of the user.
 * @return {string} The reset password token.
 */
const generateResetPasswordToken = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with this email");
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

export {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
