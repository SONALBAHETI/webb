import express from "express";
import auth from "../../middlewares/auth.js";
import {
  getExpertiseAreaSuggestions,
  getPracticeAreaSuggestions,
  getPrimaryInterestSuggestions,
  submitOnboardingForm,
} from "../../controllers/onboarding.controller.js";
import responseHandler from "../../utils/responseHandler.js";
import { onboardingValidation } from "../../validation/index.js";
import validate from "../../middlewares/validate.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router.get(
  "/suggestions/primaryinterests",
  auth(Permission.ReadSuggestions),
  validate(onboardingValidation.getSuggestions),
  responseHandler(getPrimaryInterestSuggestions)
);

router.get(
  "/suggestions/expertiseareas",
  auth(Permission.ReadSuggestions),
  validate(onboardingValidation.getSuggestions),
  responseHandler(getExpertiseAreaSuggestions)
);

router.get(
  "/suggestions/practiceareas",
  auth(Permission.ReadSuggestions),
  validate(onboardingValidation.getSuggestions),
  responseHandler(getPracticeAreaSuggestions)
);

router.post(
  "/form/submit",
  auth(),
  validate(onboardingValidation.submitOnboardingForm),
  responseHandler(submitOnboardingForm)
);

export default router;
