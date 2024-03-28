import httpStatus from "http-status";
import { createUser } from "../services/user.service.js";
import {
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
} from "../services/token.service.js";
import {
  loginUserWithEmailAndPassword,
  refreshAuth,
  logout as logoutUser,
  getOrCreateUserWithGoogle,
  verifyEmail as verifyEmailHelper,
  changePassword,
} from "../services/auth.service.js";
import emailService from "../services/email.service.js";
import express from "express";
import config from "../config/config.js";

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
const register = async (req, res) => {
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
  // send verification email
  const verifyEmailToken = await generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail({
    to: user.email,
    token: verifyEmailToken,
    redirect: `${config.frontendBaseUrl}/onboarding`,
    context: {
      firstName: user.getFirstName(),
    },
  });
  // generate auth token and send it to client
  const tokens = await generateAuthTokens(user.id);
  setCookies(res, tokens).status(httpStatus.CREATED).send({
    userId: user.id,
    accessToken: tokens.access,
  });
};

// login a user with email and password
const loginWithEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUserWithEmailAndPassword(email, password);
  const tokens = await generateAuthTokens(user.id);
  setCookies(res, tokens).status(httpStatus.OK).send({
    userId: user.id,
    accessToken: tokens.access,
  });
};

/**
 * Registers or logs in a user with Google credentials.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const loginWithGoogle = async (req, res) => {
  const { credential } = req.body;
  const user = await getOrCreateUserWithGoogle(credential);
  const tokens = await generateAuthTokens(user.id);
  setCookies(res, tokens).status(httpStatus.OK).send({
    userId: user.id,
    isOnboarded: user.accountStatus.isOnboarded,
    accessToken: tokens.access,
  });
};

// refresh access token
const refreshTokens = async (req, res) => {
  const tokens = await refreshAuth(
    req.cookies["refreshToken"] || req.body.refreshToken
  );
  setCookies(res, tokens).status(httpStatus.OK).send({ tokens });
};

// verify authentication
const verifyAuth = async (req, res) => {
  res.status(httpStatus.OK).send({});
};

// logout
const logout = async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
  await logoutUser(refreshToken);
  clearCookies(res).status(httpStatus.OK).send({});
};

/**
 * Sends verification email.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const sendVerificationEmail = async (req, res) => {
  const verifyEmailToken = await generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail({
    to: req.user.email,
    token: verifyEmailToken,
    redirect: `${config.frontendBaseUrl}/onboarding`,
    context: {
      firstName: req.user.getFirstName(),
    },
  });
  res.status(httpStatus.NO_CONTENT).send();
};

/**
 * Verifies email using token
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const verifyEmail = async (req, res) => {
  await verifyEmailHelper(req.body.token);
  res.status(httpStatus.NO_CONTENT).send();
};

/**
 * Sends reset password email.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const sendResetPasswordEmail = async (req, res) => {
  const { email, redirect } = req.body;
  const verifyEmailToken = await generateResetPasswordToken(email);

  await emailService.sendResetPasswordVerificationEmail({
    to: email,
    token: verifyEmailToken,
    redirect,
  });
  res.status(httpStatus.NO_CONTENT).send();
};

/**
 * Sends reset password email when user is authenticated
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const sendResetPasswordEmailWithAuth = async (req, res) => {
  const { redirect } = req.body;
  const verifyEmailToken = await generateResetPasswordToken(req.user.email);

  await emailService.sendResetPasswordVerificationEmail({
    to: req.user.email,
    token: verifyEmailToken,
    redirect,
  });
  res.status(httpStatus.NO_CONTENT).send();
}

/**
 * Resets the password of the user using token
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const resetPassword = async (req, res) => {
  await changePassword(req.body.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  register,
  loginWithEmailAndPassword,
  refreshTokens,
  verifyAuth,
  logout,
  loginWithGoogle,
  sendVerificationEmail,
  verifyEmail,
  sendResetPasswordEmail,
  sendResetPasswordEmailWithAuth,
  resetPassword,
};
