import express from "express";
import { mentorVerificationValidation } from "../../validation/index.js";
import validate from "../../middlewares/validate.js";
import responseHandler from "../../utils/responseHandler.js";
import {
  submitVerificationData,
  getOrganizations,
  getOrgSearchUrl,
  getVerificationStep,
  uploadDocuments,
} from "../../controllers/mentorVerification.controller.js";
import auth from "../../middlewares/auth.js";
import multer from "multer";

const router = express.Router();

router.get("/current-step", auth(), responseHandler(getVerificationStep));

router.post(
  "/submit-data",
  auth(),
  validate(mentorVerificationValidation.submitData),
  responseHandler(submitVerificationData)
);

router.post(
  "/doc-upload",
  auth(),
  multer().single("file"),
  validate(mentorVerificationValidation.docUpload),
  responseHandler(uploadDocuments)
);

router.get("/organizations/search-url", responseHandler(getOrgSearchUrl));

router.get(
  "/organizations/search",
  auth(),
  validate(mentorVerificationValidation.getOrganizations),
  responseHandler(getOrganizations)
);

export default router;
