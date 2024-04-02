import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { chatbotValidation } from "../../validation/index.js";
import {
  sendMessage,
  retrieveRunStatus,
  retrieveMessages,
} from "../../controllers/chatbot.controller.js";
import responseHandler from "../../utils/responseHandler.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router
  .route("/messages")
  .get(auth(Permission.ReadChatbotMessages), responseHandler(retrieveMessages))
  .post(
    auth(Permission.CreateChatbotMessages),
    validate(chatbotValidation.sendMessage),
    responseHandler(sendMessage)
  );

router.get(
  "/runstatus/:id",
  auth(Permission.ReadChatbotMessages),
  validate(chatbotValidation.retrieveRunStatus),
  responseHandler(retrieveRunStatus)
);

export default router;
