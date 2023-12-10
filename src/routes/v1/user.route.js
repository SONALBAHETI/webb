import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { userValidation } from "../../validation/index.js";
import { updateUserDetailsFromOnboarding } from "../../controllers/user.controller.js";

const router = express.Router();

router
  .route("/:userId/updateUserDetailsFromOnboarding")
  .patch(
    auth(),
    validate(userValidation.updateUserDetailsFromOnboarding),
    updateUserDetailsFromOnboarding
  );

export default router;
