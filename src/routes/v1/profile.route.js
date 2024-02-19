import express from "express";
import auth from "../../middlewares/auth.js";
import catchAsync from "../../utils/catchAsync.js";
import validate from "../../middlewares/validate.js";
import { submitMyInformation } from "../../controllers/profile.controller.js";
import profileValidation from "../../validation/profile.validation.js";
const router = express.Router();

router.post(
  "/form/submit",
  validate(profileValidation.submitProfileForm),
  catchAsync(submitMyInformation)
);

export default router;
