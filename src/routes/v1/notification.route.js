import express from "express";
import notificationController from "../../controllers/notification.controller.js";
import auth from "../../middlewares/auth.js"; // Import your authentication middleware
import responseHandler from "../../utils/responseHandler.js";

const router = express.Router();

router
  .route("/")
  .get(auth(), responseHandler(notificationController.getNotifications));

export default router;
