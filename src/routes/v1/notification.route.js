import express from "express";
import notificationController from "../../controllers/notification.controller.js";
import auth from "../../middlewares/auth.js"; // Import your authentication middleware
import catchAsync from "../../utils/catchAsync.js";

const router = express.Router();

router
  .route("/")
  .get(auth(), catchAsync(notificationController.getNotifications));

export default router;
