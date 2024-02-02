import express from "express";
import auth from "../../middlewares/auth.js";
import {
  getExpertiseAreaSuggestions,
  getPracticeAreaSuggestions,
  getPrimaryInterestSuggestions,
  submitOnboardingForm,
} from "../../controllers/onboarding.controller.js";
import catchAsync from "../../utils/catchAsync.js";
import { onboardingValidation } from "../../validation/index.js";
import validate from "../../middlewares/validate.js";

const router = express.Router();

router.get(
  "/suggestions/primaryinterests",
  auth(),
  validate(onboardingValidation.getSuggestions),
  catchAsync(getPrimaryInterestSuggestions)
);

router.get(
  "/suggestions/expertiseareas",
  auth(),
  validate(onboardingValidation.getSuggestions),
  catchAsync(getExpertiseAreaSuggestions)
);

router.get(
  "/suggestions/practiceareas",
  auth(),
  validate(onboardingValidation.getSuggestions),
  catchAsync(getPracticeAreaSuggestions)
);

router.post(
  "/form/submit",
  auth(),
  validate(onboardingValidation.submitOnboardingForm),
  catchAsync(submitOnboardingForm)
);

export default router;
