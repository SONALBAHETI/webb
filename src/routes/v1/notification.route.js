import express from "express";
import notificationController from "../../controllers/notification.controller.js";
import auth from "../../middlewares/auth.js"; // Import your authentication middleware
import responseHandler from "../../utils/responseHandler.js";
import validate from "../../middlewares/validate.js";
import notificationValidation from "../../validation/notification.validation.js";

const router = express.Router();

router
  .route("/")
  .get(
    auth(),
    validate(notificationValidation.getNotification),
    responseHandler(notificationController.getNotifications)
  );

router.get(
  "/unread/count",
  auth(),
  responseHandler(notificationController.getUnreadNotificationsCount)
);

export default router;
