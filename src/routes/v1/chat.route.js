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
import responseHandler from "../../utils/responseHandler.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router.get(
  "/credentials",
  auth(Permission.ReadSendbirdCredentials),
  responseHandler(getSendbirdCredentials)
);

router
  .route("/requests")
  .get(auth(Permission.ReadChatRequests), responseHandler(listChatRequests))
  .post(
    auth(Permission.CreateChatRequests),
    validate(chatValidation.sendChatRequest),
    responseHandler(sendChatRequest)
  );

router.get(
  "/requests/:id",
  auth(Permission.ReadChatRequests),
  validate(chatValidation.getChatRequest),
  responseHandler(getChatRequest)
);

router.post(
  "/requests/accept",
  auth(Permission.UpdateChatRequests),
  validate(chatValidation.acceptChatRequest),
  responseHandler(acceptChatRequest)
);

router.post(
  "/requests/reject",
  auth(Permission.DeleteChatRequests),
  validate(chatValidation.rejectChatRequest),
  responseHandler(rejectChatRequest)
);

export default router;
