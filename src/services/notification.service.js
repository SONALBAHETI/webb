import Notification from "../models/notification.model.js";

const createNotification = async (notificationBody) => {
  return Notification.create({ ...notificationBody });
};

/**
 * Query for notification
 * @param {Object} query - Mongo query
 * @param {import("../models/plugins/paginate.plugin.js").PaginationOptions} options - pagination options
 * @returns {Promise<import("../models/plugins/paginate.plugin.js").PaginationResult>}
 */
const queryNotifications = async (query, options) => {
  const result = await Notification.paginate(query, options);
  return result;
};

const getNotificationById = async (notificationId) => {
  return Notification.findById(notificationId);
};

export default {
  createNotification,
  queryNotifications,
  getNotificationById,
};
