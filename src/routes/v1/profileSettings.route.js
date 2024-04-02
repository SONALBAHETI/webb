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
import { Permission } from "../../config/permissions.js";

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const router = express.Router();

// get user profile
router.get(
  "/user-profile",
  auth(Permission.ReadUserProfile),
  responseHandler(getUserProfile)
);

// upload profile picture
router.post(
  "/profile-picture",
  auth(Permission.UpdateUserProfile),
  upload.single("image"),
  validate(profileValidation.uploadProfilePicture),
  responseHandler(uploadProfilePicture)
);

// suggest personal interests
router.get(
  "/suggestions/personal-interests",
  auth(Permission.ReadSuggestions),
  validate(profileValidation.getSuggestions),
  responseHandler(getPersonalInterestsSuggestions)
);

// suggest religious affiliations
router.get(
  "/suggestions/religious-affiliations",
  auth(Permission.ReadSuggestions),
  validate(profileValidation.getSuggestions),
  responseHandler(getReligiousAffiliationsSuggestions)
);

// suggest degrees
router.get(
  "/suggestions/degrees",
  auth(Permission.ReadSuggestions),
  validate(profileValidation.getSuggestions),
  responseHandler(getDegreeSuggestions)
);

// suggest universities
router.get(
  "/suggestions/universities",
  auth(Permission.ReadSuggestions),
  validate(profileValidation.getSuggestions),
  responseHandler(getUniversitySuggestions)
);

// suggest commonly treated diagnoses
router.get(
  "/suggestions/commonly-treated-diagnoses",
  auth(Permission.ReadSuggestions),
  validate(profileValidation.getSuggestions),
  responseHandler(getCommonlyTreatedDiagnosesSuggestions)
);

// suggest board specialties
router.get(
  "/suggestions/board-specialties",
  auth(Permission.ReadSuggestions),
  validate(profileValidation.getSuggestions),
  responseHandler(getBoardSpecialtiesSuggestions)
);

// suggest residency programs
router.get(
  "/suggestions/residency-programs",
  auth(Permission.ReadSuggestions),
  validate(profileValidation.getSuggestions),
  responseHandler(getResidencyProgramSuggestions)
);

// suggest fellowship programs
router.get(
  "/suggestions/fellowship-programs",
  auth(Permission.ReadSuggestions),
  validate(profileValidation.getSuggestions),
  responseHandler(getFellowshipProgramSuggestions)
);

// submit identity information form
router.post(
  "/identity-info",
  auth(Permission.UpdateUserProfile),
  validate(profileValidation.submitIdentityInfo),
  responseHandler(submitIdentityInformation)
);

// submit education form
router.post(
  "/education",
  auth(Permission.UpdateUserProfile),
  validate(profileValidation.educationForm),
  responseHandler(submitEducationForm)
);

// add new degree to user's profile
router.post(
  "/education/degrees",
  auth(Permission.UpdateUserProfile),
  validate(profileValidation.addNewDegree),
  responseHandler(addNewDegree)
);

// add new certificate to user's profile
router.post(
  "/education/certificates",
  auth(Permission.UpdateUserProfile),
  validate(profileValidation.addNewCertificate),
  responseHandler(addNewCertificate)
);

// submit expertise form
router.post(
  "/expertise",
  auth(Permission.UpdateUserProfile),
  validate(profileValidation.expertiseForm),
  responseHandler(submitExpertiseForm)
);

export default router;
