import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { getUserMatch } from "../../controllers/userMatch.controller.js";
import userMatchValidation from "../../validation/userMatch.validation.js";
import responseHandler from "../../utils/responseHandler.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router.get(
  "/:id",
  auth(Permission.ReadUserMatches),
  validate(userMatchValidation.getUserMatch),
  responseHandler(getUserMatch)
);

export default router;
