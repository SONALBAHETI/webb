import express from "express";
import { authValidation } from "../../validation/index.js";
import authController from "../../controllers/auth.controller.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";
import responseHandler from "../../utils/responseHandler.js";

const router = express.Router();

// sign up a new user
router.post(
  "/register",
  validate(authValidation.register),
  responseHandler(authController.register)
);

// login user using email and password
router.post(
  "/login/email-password",
  validate(authValidation.loginWithEmailAndPassword),
  responseHandler(authController.loginWithEmailAndPassword)
);

// login or register user using Google credentials
router.post(
  "/login/google",
  validate(authValidation.loginWithGoogle),
  responseHandler(authController.loginWithGoogle)
);

// refresh auth tokens
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  responseHandler(authController.refreshTokens)
);

// verify authentication
router.get("/verify-auth", auth(), responseHandler(authController.verifyAuth));

// logout users
router.post("/logout", responseHandler(authController.logout));

// send verification email
router.post(
  "/send-verification-email",
  auth(),
  responseHandler(authController.sendVerificationEmail)
);

// verify email
router.post(
  "/verify-email",
  validate(authValidation.verifyEmail),
  responseHandler(authController.verifyEmail)
);

// send reset password email
router.post(
  "/send-reset-password-email",
  validate(authValidation.resetPasswordEmail),
  responseHandler(authController.sendResetPasswordEmail)
);

// reset password
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  responseHandler(authController.resetPassword)
);

export default router;
