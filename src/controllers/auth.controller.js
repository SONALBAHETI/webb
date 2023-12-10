import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import { createUser } from "../services/user.service.js";
import { generateAuthTokens } from "../services/token.service.js";
import {
  loginUserWithEmailAndPassword,
  refreshAuth,
  logout as logoutUser,
} from "../services/auth.service.js";

/**
 * Sets the tokens as cookies in the response object.
 *
 * @param {Object} res - The response object.
 * @param {Object} tokens - The tokens object containing refresh and access tokens.
 * @return {Object} The updated response object with cookies set.
 */
const setCookies = (res, tokens) => {
  return res
    .cookie("refreshToken", tokens.refresh.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      expires: tokens.refresh.expires,
    })
    .cookie("accessToken", tokens.access.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      expires: tokens.access.expires,
    });
};

/**
 * Clears the tokens from cookies in the response object.
 *
 * @param {object} res - The response object.
 * @return {object} The updated response object.
 */
const clearCookies = (res) => {
  return res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    })
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
};

// register a user
const register = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const newUser = {
    profile: {
      firstName,
      lastName,
    },
    name: `${firstName} ${lastName}`,
    email,
    password,
  };
  const user = await createUser(newUser);
  // generate auth token and send it to client
  const tokens = await generateAuthTokens(user);
  setCookies(res, tokens).status(httpStatus.CREATED).send({
    user,
    tokens,
  });
});

// login a user with email and password
const loginWithEmailAndPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUserWithEmailAndPassword(email, password);
  const tokens = await generateAuthTokens(user);
  setCookies(res, tokens).status(httpStatus.OK).send({
    user,
    tokens,
  });
});

// refresh access token
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await refreshAuth(
    req.cookies["refreshToken"] || req.body.refreshToken
  );
  setCookies(res, tokens).status(httpStatus.OK).send({ tokens });
});

// verify authentication
const verifyAuth = catchAsync(async (req, res) => {
  const user = req.user;
  res.status(httpStatus.OK).send({ user });
});

// logout
const logout = catchAsync(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
  await logoutUser(refreshToken);
  clearCookies(res).status(httpStatus.OK).send({});
});

export default {
  register,
  loginWithEmailAndPassword,
  refreshTokens,
  verifyAuth,
  logout,
};
