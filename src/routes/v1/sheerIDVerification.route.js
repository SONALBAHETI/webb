import express from "express";
import multer from "multer";
import { sheerIDVerificationValidation } from "../../validation/index.js";
import validate from "../../middlewares/validate.js";
import sheerIDVerificationController from "../../controllers/sheerIDVerification.controller.js";
import auth from "../../middlewares/auth.js";
import responseHandler from "../../utils/responseHandler.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router.post(
  "/doc-upload",
  auth(Permission.SubmitSheerIDDocuments),
  multer().single("file"),
  validate(sheerIDVerificationValidation.docUpload),
  responseHandler(sheerIDVerificationController.uploadDocuments)
);

export default router;