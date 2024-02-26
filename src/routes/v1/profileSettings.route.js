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
  getDegreeSuggestions,
  getUniversitySuggestions,
  addNewDegree,
  addNewCertificate,
} from "../../controllers/profileSettings.controller.js";
import profileValidation from "../../validation/profileSettings.validation.js";
const router = express.Router();

router.get("/user-profile", auth(), catchAsync(getUserProfile));

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
  "/suggestions/degrees",
  auth(),
  validate(profileValidation.getSuggestions),
  catchAsync(getDegreeSuggestions)
);

router.get(
  "/suggestions/universities",
  auth(),
  validate(profileValidation.getSuggestions),
  catchAsync(getUniversitySuggestions)
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

router.post(
  "/identity-info",
  auth(),
  validate(profileValidation.submitIdentityInfo),
  catchAsync(submitIdentityInformation)
);

router.post(
  "/education/degrees",
  auth(),
  validate(profileValidation.addNewDegree),
  catchAsync(addNewDegree)
);

router.post(
  "/education/certificates",
  auth(),
  validate(profileValidation.addNewCertificate),
  catchAsync(addNewCertificate)
);

export default router;
