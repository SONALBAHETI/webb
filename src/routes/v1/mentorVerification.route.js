import express from "express";
import {
  mentorVerificationValidation,
  sheerIDVerificationValidation,
} from "../../validation/index.js";
import validate from "../../middlewares/validate.js";
import responseHandler from "../../utils/responseHandler.js";
import {
  submitVerificationData,
  getOrganizations,
  getOrgSearchUrl,
  getVerificationStep,
} from "../../controllers/mentorVerification.controller.js";
import auth from "../../middlewares/auth.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router.get(
  "/current-step",
  auth(Permission.LicenseVerification),
  responseHandler(getVerificationStep)
);

router.post(
  "/submit-data",
  auth(Permission.LicenseVerification),
  validate(mentorVerificationValidation.submitData),
  responseHandler(submitVerificationData)
);

router.get(
  "/organizations/search-url",
  auth(Permission.LicenseVerification),
  responseHandler(getOrgSearchUrl)
);

router.get(
  "/organizations/search",
  auth(Permission.LicenseVerification),
  validate(sheerIDVerificationValidation.getOrganizations),
  responseHandler(getOrganizations)
);

export default router;
