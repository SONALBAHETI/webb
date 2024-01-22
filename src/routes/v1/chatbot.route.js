import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { chatbotValidation } from "../../validation/index.js";
import {
  sendMessage,
  retrieveRunStatus,
  retrieveMessages,
} from "../../controllers/chatbot.controller.js";
import catchAsync from "../../utils/catchAsync.js";

const router = express.Router();

router
  .route("/messages")
  .get(auth(), catchAsync(retrieveMessages))
  .post(
    auth(),
    validate(chatbotValidation.sendMessage),
    catchAsync(sendMessage)
  );

router.get(
  "/runstatus/:id",
  auth(),
  validate(chatbotValidation.retrieveRunStatus),
  catchAsync(retrieveRunStatus)
);

export default router;
