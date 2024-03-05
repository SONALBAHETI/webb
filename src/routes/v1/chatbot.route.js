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

const router = express.Router();

router
  .route("/messages")
  .get(auth(), responseHandler(retrieveMessages))
  .post(
    auth(),
    validate(chatbotValidation.sendMessage),
    responseHandler(sendMessage)
  );

router.get(
  "/runstatus/:id",
  auth(),
  validate(chatbotValidation.retrieveRunStatus),
  responseHandler(retrieveRunStatus)
);

export default router;
