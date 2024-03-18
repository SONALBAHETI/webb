import mongoose from "mongoose";
import { paginate, toJSON } from "./plugins/index.js";
import notificationTrigger from "../triggers/notification.trigger.js";

/**
 * @typedef {"ChatRequestAccepted"} NotificationTypeSchema
 */
export const NotificationType = {
  ChatRequestAccepted: "ChatRequestAccepted",
};

export const NotificationStatus = {
  PENDING: "pending",
  SENT: "sent",
  READ: "read",
  CLEARED: "cleared",
};

/**
 * @typedef {Object} NotificationSchema
 * @property {string} receiver - The receiver of the notification
 * @property {string} title - The title of the notification
 * @property {NotificationTypeSchema} type - The type of the notification
 * @property {string} [description] - The description of the notification
 * @property {string} [metadata] - The metadata of the notification
 * @property {boolean} [read] - The read status of the notification
 */
export const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, require: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    description: String,
    metadata: { type: Object, default: {} },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      required: true,
      default: NotificationStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

/* Plugins */
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);
notificationSchema.plugin(notificationTrigger);

/**
 * @typedef {mongoose.Document & NotificationSchema} Notification
 */
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
