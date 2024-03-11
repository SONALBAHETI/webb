import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { chatValidation } from "../../validation/index.js";
import {
  listChatRequests,
  getChatRequest,
  sendChatRequest,
  acceptChatRequest,
  rejectChatRequest,
  getSendbirdCredentials,
} from "../../controllers/chat.controller.js";

const router = express.Router();

router.get("/credentials", auth(), responseHandler(getSendbirdCredentials));

router
  .route("/requests")
  .get(auth(), listChatRequests)
  .post(auth(), validate(chatValidation.sendChatRequest), sendChatRequest);

router.get(
  "/requests/:id",
  auth(),
  validate(chatValidation.getChatRequest),
  getChatRequest
);

router.post(
  "/requests/accept",
  auth(),
  validate(chatValidation.acceptChatRequest),
  acceptChatRequest
);

router.post(
  "/requests/reject",
  auth(),
  validate(chatValidation.rejectChatRequest),
  rejectChatRequest
);

export default router;
