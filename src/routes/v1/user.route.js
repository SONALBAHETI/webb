import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { userValidation } from "../../validation/index.js";
import userController from "../../controllers/user.controller.js";
import responseHandler from "../../utils/responseHandler.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router.get(
  "/achievements",
  auth(Permission.ReadUserProfile),
  responseHandler(userController.getAchievements)
);

router
  .route("/visibility")
  .get(
    auth(Permission.ReadVisibility),
    responseHandler(userController.getVisibility)
  )
  .post(
    auth(Permission.UpdateVisibility),
    validate(userValidation.updateVisibility),
    responseHandler(userController.updateVisibility)
  );

router
  .route("/availability")
  .get(
    auth(Permission.ReadAvailability),
    responseHandler(userController.getAvailability)
  )
  .post(
    auth(Permission.UpdateAvailability),
    validate(userValidation.updateAvailability),
    responseHandler(userController.updateAvailability)
  );

router.route("/rights").get(auth(), responseHandler(userController.getRights));

export default router;
