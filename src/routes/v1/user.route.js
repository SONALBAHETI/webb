import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { userValidation } from "../../validation/index.js";
import userController from "../../controllers/user.controller.js";
import responseHandler from "../../utils/responseHandler.js";

const router = express.Router();

router.get(
  "/achievements",
  auth(),
  responseHandler(userController.getAchievements)
);

router
  .route("/visibility")
  .get(auth(), responseHandler(userController.getVisibility))
  .post(
    auth(),
    validate(userValidation.updateVisibility),
    responseHandler(userController.updateVisibility)
  );

router
  .route("/availability")
  .get(auth(), responseHandler(userController.getAvailability))
  .post(
    auth(),
    validate(userValidation.updateAvailability),
    responseHandler(userController.updateAvailability)
  );

export default router;
