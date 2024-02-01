import express from "express";
import auth from "../../middlewares/auth.js";
import {
  getExpertiseAreaSuggestions,
  getPracticeAreaSuggestions,
  getPrimaryInterestSuggestions,
} from "../../controllers/onboarding.controller.js";
import catchAsync from "../../utils/catchAsync.js";

const router = express.Router();

router.get(
  "/suggestions/primaryinterests",
  auth(),
  catchAsync(getPrimaryInterestSuggestions)
);

router.get(
  "/suggestions/expertiseareas",
  auth(),
  catchAsync(getExpertiseAreaSuggestions)
);

router.get(
  "/suggestions/practiceareas",
  auth(),
  catchAsync(getPracticeAreaSuggestions)
);

export default router;
