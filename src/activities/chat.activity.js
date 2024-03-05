import logger from "../config/logger.js";
import User from "../models/user.model.js";
import { incrementChatMessagesSent } from "../services/userStats.service.js";

/**
 * Performs actions when a chat message is sent
 * @param {string} sendbirdUserId - The Sendbird user ID to search for the message sender in database.
 */
const messageSent = async (sendbirdUserId) => {
  // find the user in the database
  const user = await User.findOne({
    "integrations.sendbird.userId": sendbirdUserId,
  }).select("_id");

  if (user) {
    // increase the number of messages sent in user stats
    await incrementChatMessagesSent(user.id);
  } else {
    // log a warning if the user is not found
    logger.warn(`User with sendbirdUserId '${sendbirdUserId}' not found`);
  }
};

export default {
  messageSent,
};
