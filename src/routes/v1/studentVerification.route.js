import express from "express";
import { studentVerificationValidation, sheerIDVerificationValidation } from "../../validation/index.js";
import validate from "../../middlewares/validate.js";
import responseHandler from "../../utils/responseHandler.js";
import studentVerificationController from "../../controllers/studentVerification.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.get("/current-step", auth(), responseHandler(studentVerificationController.getVerificationStep));

router.post(
  "/submit-data",
  auth(),
  validate(studentVerificationValidation.submitData),
  responseHandler(studentVerificationController.submitVerificationData)
);

router.get("/organizations/search-url", responseHandler(studentVerificationController.getOrgSearchUrl));

router.get(
  "/organizations/search",
  auth(),
  validate(sheerIDVerificationValidation.getOrganizations),
  responseHandler(studentVerificationController.getOrganizations)
);

export default router;