import express from "express";
import auth from "../../middlewares/auth.js";
import userReportController from "../../controllers/userReport.controller.js";
import validate from "../../middlewares/validate.js";
import responseHandler from "../../utils/responseHandler.js";
import { Permission } from "../../config/permissions.js";
import userReportValidation from "../../validation/userReport.validation.js";

const router = express.Router();

// report a user for misbehaviour
router.post(
  "/report/user/:id",
  auth(Permission.CreateUserReports),
  validate(userReportValidation.reportUser),
  responseHandler(userReportController.reportUser)
);

export default router;
