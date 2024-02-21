import express from "express";
import auth from "../../middlewares/auth.js";
import catchAsync from "../../utils/catchAsync.js";
import validate from "../../middlewares/validate.js";
import {
  getBoardSpecialties,
  getCommonlyDiagnoses,
  submitMyInformation,
} from "../../controllers/profile.controller.js";
import profileValidation from "../../validation/profile.validation.js";
const router = express.Router();

router.post(
  "/form/submit",
  auth(),
  validate(profileValidation.submitProfileForm),
  catchAsync(submitMyInformation)
);

router.get(
  "/suggestions/commonlydiagnoses",
  auth(),
  validate(profileValidation.getSuggestions),
  catchAsync(getCommonlyDiagnoses)
);

router.get(
  "/suggestions/boardSpecialties",
  auth(),
  validate(profileValidation.getSuggestions),
  catchAsync(getBoardSpecialties)
);

export default router;
