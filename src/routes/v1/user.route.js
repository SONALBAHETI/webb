import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { userValidation } from "../../validation/index.js";
import userController from "../../controllers/user.controller.js";
import responseHandler from "../../utils/responseHandler.js";

const router = express.Router();

router
  .route("/:userId/updateUserDetailsFromOnboarding")
  .patch(
    auth(),
    validate(userValidation.updateUserDetailsFromOnboarding),
    userController.updateUserDetailsFromOnboarding
  );

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

export default router;
