import { getUserById, updateUser } from "./user.service.js";

/**
 * Increments the number of chat messages sent by a user.
 *
 * @param {string} userId - The ID of the user whose chat messages sent count will be incremented.
 */
const incrementChatMessagesSent = async (userId) => {
  const user = await getUserById(userId).select("stats");
  if (!user) {
    throw new Error("User not found");
  }
  await updateUser(userId, {
    stats: {
      chatMessagesSent: (user.getStats().chatMessagesSent || 0) + 1,
    },
  });
};

/**
 * Increments the number of chat messages read for a specific user.
 *
 * @param {string} userId - The ID of the user whose chat messages read count will be incremented
 */
const incrementChatMessagesRead = async (userId) => {
  const user = await getUserById(userId).select("stats");
  if (!user) {
    throw new Error("User not found");
  }
  await updateUser(userId, {
    stats: {
      chatMessagesRead: (user.getStats().chatMessagesRead || 0) + 1,
    },
  });
};

export { incrementChatMessagesSent, incrementChatMessagesRead };
