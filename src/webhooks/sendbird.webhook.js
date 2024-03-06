import { Router, text } from "express";
import httpStatus from "http-status";
import { createHmac } from "crypto";
import config from "../config/config.js";
import handleWebhookAsync from "../utils/handleWebhookAsync.js";
import chatActivity from "../activities/chat.activity.js";
import SendbirdEvent from "../constants/sendbird.js";
import logger from "../config/logger.js";

const router = Router();

const API_TOKEN = config.sendBird.apiToken; // master API token.

/**
 * Validates and parses the webhook request body, and checks the signature.
 * The req.body should be a string.
 * Validation fails if the body is passed as a JSON object and then stringified.
 */
const verifySignature = (req, res, next) => {
  const body = req.body;
  const signature = req.get("x-sendbird-signature");
  const hash = createHmac("sha256", API_TOKEN).update(body).digest("hex");

  req.body = JSON.parse(body); // Convert the body to JSON after creating the hash.

  if (signature !== hash) {
    // return 401 if the signature is invalid
    return res.send(httpStatus.UNAUTHORIZED);
  } else {
    // success
    next();
  }
};

// process the webhook asynchronously and send response asap
const sendbirdWebhook = (req) => {
  const { body: event } = req;
  logger.info("🚀 ~ sendbirdWebhook ~ event:", event);
  // message send event
  if (event.category === SendbirdEvent.Group.MessageSend) {
    chatActivity.messageSent(event.sender.user_id);
  } // message read event
  else if (event.category === SendbirdEvent.Group.MessageRead) {
    const readUpdates = event.read_updates;
    if (Array.isArray(readUpdates)) {
      readUpdates.forEach((readUpdate) => {
        chatActivity.messageRead(readUpdate.user_id);
      });
    }
  }
};

router.post(
  "/",
  text({ type: "json" }),
  verifySignature,
  handleWebhookAsync(sendbirdWebhook)
);

export default router;
