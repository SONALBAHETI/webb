import express from "express";
import auth from "../../middlewares/auth.js";
import { getPrimaryInterests } from "../../controllers/onboarding.controller.js";
import catchAsync from "../../utils/catchAsync.js";

const router = express.Router();

router.get(
  "/suggestions/primaryinterests",
  auth(),
  catchAsync(getPrimaryInterests)
);

export default router;
