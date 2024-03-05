import User from "../models/user.model.js";

/**
 * Increments the number of chat messages sent by a user.
 *
 * @param {string} userId - The ID of the user whose chat messages sent count will be incremented.
 */
const incrementChatMessagesSent = async (userId) => {
  await User.updateOne(
    { _id: userId },
    { $inc: { "stats.chatMessagesSent": 1 } }
  );
};

export { incrementChatMessagesSent };
