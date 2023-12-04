import express from "express";
import { authValidation } from "../../validation/index.js";
import { authController } from "../../controllers/index.js";
import validate from "../../middlewares/validate.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

// sign up a new user
router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

// login user using email and password
router.post(
  "/login/email-password",
  validate(authValidation.loginWithEmailAndPassword),
  authController.loginWithEmailAndPassword
);

// refresh auth tokens
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

// verify authentication
router.get("/verify-auth", auth(), authController.verifyAuth);

// logout users
router.post("/logout", authController.logout);

export default router;
