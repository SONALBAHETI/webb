import express from "express";
import auth from "../../middlewares/auth.js";
import catchAsync from "../../utils/catchAsync.js";
import validate from "../../middlewares/validate.js";
import {
  getPersonalInterestsSuggestions,
  getBoardSpecialtiesSuggestions,
  getCommonlyTreatedDiagnosesSuggestions,
  submitIdentityInformation,
  getUserProfile,
  getReligiousAffiliationsSuggestions,
} from "../../controllers/profileSettings.controller.js";
import profileValidation from "../../validation/profileSettings.validation.js";
const router = express.Router();

router.get("/user-profile", auth(), catchAsync(getUserProfile));

router.post(
  "/form/identity-info/submit",
  auth(),
  validate(profileValidation.submitIdentityInfo),
  catchAsync(submitIdentityInformation)
);

router.get(
  "/suggestions/personal-interests",
  auth(),
  validate(profileValidation.getSuggestions),
  catchAsync(getPersonalInterestsSuggestions)
);

router.get(
  "/suggestions/religious-affiliations",
  auth(),
  validate(profileValidation.getSuggestions),
  catchAsync(getReligiousAffiliationsSuggestions)
);

router.get(
  "/suggestions/commonly-treated-diagnoses",
  auth(),
  validate(profileValidation.getSuggestions),
  catchAsync(getCommonlyTreatedDiagnosesSuggestions)
);

router.get(
  "/suggestions/board-specialties",
  auth(),
  validate(profileValidation.getSuggestions),
  catchAsync(getBoardSpecialtiesSuggestions)
);

export default router;
