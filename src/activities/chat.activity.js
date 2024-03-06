import logger from "../config/logger.js";
import { getUserBySendbirdId } from "../services/user.service.js";
import {
  incrementChatMessagesRead,
  incrementChatMessagesSent,
} from "../services/userStats.service.js";

const getUser = async (sendbirdUserId) => {
  return await getUserBySendbirdId(sendbirdUserId).select("_id");
};

/**
 * Performs actions when a chat message is sent
 * @param {string} sendbirdUserId - The Sendbird user ID to search for the message sender in database.
 */
const messageSent = async (sendbirdUserId) => {
  // find the user in the database
  const user = await getUser(sendbirdUserId);
  if (user) {
    // increase the number of messages sent in user stats
    await incrementChatMessagesSent(user.id);
  } else {
    // log a warning if the user is not found
    logger.warn(`User with sendbirdUserId '${sendbirdUserId}' not found`);
  }
};

const messageRead = async (sendbirdUserId) => {
  const user = await getUser(sendbirdUserId);
  if (user) {
    // increase the number of messages read in user stats
    await incrementChatMessagesRead(user.id);
  } else {
    // log a warning if the user is not found
    logger.warn(`User with sendbirdUserId '${sendbirdUserId}' not found`);
  }
};

export default {
  messageSent,
  messageRead,
};
