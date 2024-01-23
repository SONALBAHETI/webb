import express from "express";
import { authValidation } from "../../validation/index.js";
import authController from "../../controllers/auth.controller.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";
import catchAsync from "../../utils/catchAsync.js";

const router = express.Router();

// sign up a new user
router.post(
  "/register",
  validate(authValidation.register),
  catchAsync(authController.register)
);

// login user using email and password
router.post(
  "/login/email-password",
  validate(authValidation.loginWithEmailAndPassword),
  catchAsync(authController.loginWithEmailAndPassword)
);

// login or register user using Google credentials
router.post(
  "/login/google",
  validate(authValidation.loginWithGoogle),
  catchAsync(authController.loginWithGoogle)
);

// refresh auth tokens
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  catchAsync(authController.refreshTokens)
);

// verify authentication
router.get("/verify-auth", auth(), catchAsync(authController.verifyAuth));

// logout users
router.post("/logout", catchAsync(authController.logout));

export default router;
