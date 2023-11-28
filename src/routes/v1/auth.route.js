import express from "express";
import { authValidation } from "../../validation/index.js"; // import validation schema
import { authController } from "../../controllers/index.js"; // import auth controller
import validate from "../../middlewares/validate.js"; // import validate middleware

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

export default router;
