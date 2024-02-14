import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { getUserMatch } from "../../controllers/userMatch.controller.js";
import userMatchValidation from "../../validation/userMatch.validation.js";
import catchAsync from "../../utils/catchAsync.js";

const router = express.Router();

router.get(
  "/:id",
  auth(),
  validate(userMatchValidation.getUserMatch),
  catchAsync(getUserMatch)
);

export default router;
