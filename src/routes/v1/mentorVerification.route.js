import express from "express";
import { mentorVerificationValidation } from "../../validation/index.js";
import validate from "../../middlewares/validate.js";
import catchAsync from "../../utils/catchAsync.js";
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

router.get("/current-step", auth(), catchAsync(getVerificationStep));

router.post(
  "/submit-data",
  auth(),
  validate(mentorVerificationValidation.submitData),
  catchAsync(submitVerificationData)
);

router.post(
  "/doc-upload",
  auth(),
  multer().single("file"),
  validate(mentorVerificationValidation.docUpload),
  catchAsync(uploadDocuments)
);

router.get("/organizations/search-url", catchAsync(getOrgSearchUrl));

router.get(
  "/organizations/search",
  auth(),
  validate(mentorVerificationValidation.getOrganizations),
  catchAsync(getOrganizations)
);

export default router;
