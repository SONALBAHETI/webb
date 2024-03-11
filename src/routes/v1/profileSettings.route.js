import express from "express";
import auth from "../../middlewares/auth.js";
import responseHandler from "../../utils/responseHandler.js";
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
  getResidencyProgramSuggestions,
  getFellowshipProgramSuggestions,
  submitEducationForm,
  submitExpertiseForm,
  uploadProfilePicture,
} from "../../controllers/profileSettings.controller.js";
import profileValidation from "../../validation/profileSettings.validation.js";
import multer from "multer";

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const router = express.Router();

// get user profile
router.get("/user-profile", auth(), responseHandler(getUserProfile));

// upload profile picture
router.post(
  "/profile-picture",
  auth(),
  upload.single("image"),
  validate(profileValidation.uploadProfilePicture),
  responseHandler(uploadProfilePicture)
);

// suggest personal interests
router.get(
  "/suggestions/personal-interests",
  auth(),
  validate(profileValidation.getSuggestions),
  responseHandler(getPersonalInterestsSuggestions)
);

// suggest religious affiliations
router.get(
  "/suggestions/religious-affiliations",
  auth(),
  validate(profileValidation.getSuggestions),
  responseHandler(getReligiousAffiliationsSuggestions)
);

// suggest degrees
router.get(
  "/suggestions/degrees",
  auth(),
  validate(profileValidation.getSuggestions),
  responseHandler(getDegreeSuggestions)
);

// suggest universities
router.get(
  "/suggestions/universities",
  auth(),
  validate(profileValidation.getSuggestions),
  responseHandler(getUniversitySuggestions)
);

// suggest commonly treated diagnoses
router.get(
  "/suggestions/commonly-treated-diagnoses",
  auth(),
  validate(profileValidation.getSuggestions),
  responseHandler(getCommonlyTreatedDiagnosesSuggestions)
);

// suggest board specialties
router.get(
  "/suggestions/board-specialties",
  auth(),
  validate(profileValidation.getSuggestions),
  responseHandler(getBoardSpecialtiesSuggestions)
);

// suggest residency programs
router.get(
  "/suggestions/residency-programs",
  auth(),
  validate(profileValidation.getSuggestions),
  responseHandler(getResidencyProgramSuggestions)
);

// suggest fellowship programs
router.get(
  "/suggestions/fellowship-programs",
  auth(),
  validate(profileValidation.getSuggestions),
  responseHandler(getFellowshipProgramSuggestions)
);

// submit identity information form
router.post(
  "/identity-info",
  auth(),
  validate(profileValidation.submitIdentityInfo),
  responseHandler(submitIdentityInformation)
);

// submit education form
router.post(
  "/education",
  auth(),
  validate(profileValidation.educationForm),
  responseHandler(submitEducationForm)
);

// add new degree to user's profile
router.post(
  "/education/degrees",
  auth(),
  validate(profileValidation.addNewDegree),
  responseHandler(addNewDegree)
);

// add new certificate to user's profile
router.post(
  "/education/certificates",
  auth(),
  validate(profileValidation.addNewCertificate),
  responseHandler(addNewCertificate)
);

// submit expertise form
router.post(
  "/expertise",
  auth(),
  validate(profileValidation.expertiseForm),
  responseHandler(submitExpertiseForm)
);

export default router;
