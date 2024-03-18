import Notification, {
  NotificationType,
} from "../models/notification.model.js";
import { getUserById } from "./user.service.js";
import { getChatRequestById } from "./chat.service.js";
import { getSocketsByUserId } from "../config/socketio.js";
import httpStatus from "http-status";

/**
 * @typedef {import("../models/notification.model.js").NotificationSchema} NotificationSchema
 * @typedef {import("../models/notification.model.js").Notification} Notification
 */

/**
 * Create a notification.
 *
 * @param {NotificationSchema} notificationBody - The notification data.
 * @returns {Promise<Notification>} The created notification.
 */
const createNotification = async (notificationBody) => {
  return Notification.create({ ...notificationBody });
};

/**
 * Sends a notification to a specific user.
 *
 * @param {Notification} notification - The notification to be sent.
 */
const sendNotification = (notification) => {
  getSocketsByUserId(notification.receiver.toString())?.forEach((socket) => {
    socket.emit("notification", notification);
  });
};


/**
 * Creates a "ChatRequestAccepted" notification to the sender of a chat request.
 * // TODO: Move this to chat request trigger.
 *
 * @param {string} receiverId - The ID of the receiver.
 * @param {string} senderId - The ID of the sender.
 * @param {string} chatRequestId - The ID of the chat request.
 * @throws {ApiError} If any of the user or chat request is not found.
 * @returns {Promise<Notification>} The created notification.
 */
const createChatRequestAcceptedNotification = async (
  receiverId,
  senderId,
  chatRequestId
) => {
  const sender = await getUserById(senderId);
  const receiver = await getUserById(receiverId);
  const chatRequest = await getChatRequestById(chatRequestId);
  if (!sender || !receiver || !chatRequest) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid request");
  }
  return await createNotification({
    receiver: receiverId,
    title: "Chat request accepted",
    description: `${sender.getFirstName()} ${sender.getLastName()} accepted your chat request`,
    type: NotificationType.ChatRequestAccepted,
    metadata: {
      channelUrl: chatRequest.channelUrl,
    },
  });
};

/**
 * Query for notification
 * @param {Object} query - Mongo query
 * @param {PaginationOptions} options - pagination options
 * @returns {Promise<PaginationResult>}
 */
const queryNotifications = async (query, options) => {
  const result = await Notification.paginate(query, options);
  return result;
};

/**
 * Get a notification by its id.
 *
 * @param {string} notificationId - The id of the notification.
 * @returns {Promise<Notification>} The notification.
 */
const getNotificationById = (notificationId) => {
  return Notification.findById(notificationId);
};

export default {
  createNotification,
  sendNotification,
  queryNotifications,
  getNotificationById,
  createChatRequestAcceptedNotification,
};
