import express from "express";
import {
  studentVerificationValidation,
  sheerIDVerificationValidation,
} from "../../validation/index.js";
import validate from "../../middlewares/validate.js";
import responseHandler from "../../utils/responseHandler.js";
import studentVerificationController from "../../controllers/studentVerification.controller.js";
import auth from "../../middlewares/auth.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router.get(
  "/current-step",
  auth(Permission.StudentVerification),
  responseHandler(studentVerificationController.getVerificationStep)
);

router.post(
  "/submit-data",
  auth(Permission.StudentVerification),
  validate(studentVerificationValidation.submitData),
  responseHandler(studentVerificationController.submitVerificationData)
);

router.get(
  "/organizations/search-url",
  auth(Permission.StudentVerification),
  responseHandler(studentVerificationController.getOrgSearchUrl)
);

router.get(
  "/organizations/search",
  auth(Permission.StudentVerification),
  validate(sheerIDVerificationValidation.getOrganizations),
  responseHandler(studentVerificationController.getOrganizations)
);

export default router;