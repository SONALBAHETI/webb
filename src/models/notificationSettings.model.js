import mongoose from "mongoose";
import { toJSON } from "./plugins.js";

/**
 * @typedef {Object} NotificationTypeSettingSchema
 * @param {Boolean} newMessage - Whether to send new message notifications
 * @param {Boolean} appointmentReminder - Whether to send appointment reminder notifications
 * @param {Boolean} systemUpdates - Whether to send system updates notifications
 * @param {Boolean} ratingReminder - Whether to send rating reminder notifications
 * @param {Boolean} reviewReceived - Whether to send review received notifications
 * @param {Boolean} accountActivity - Whether to send account activity notifications
 * @param {Boolean} successfulReferral - Whether to send successful referral notifications
 * @param {Boolean} newBadgeReceived - Whether to send new badge received notifications
 * @param {Boolean} promotional - Whether to send promotional notifications
 * @param {Boolean} reminders - Whether to send reminders
 */
const notificationTypeSettingSchema = new mongoose.Schema({
  newMessage: {
    type: Boolean,
    default: true,
  },
  appointmentReminder: {
    type: Boolean,
    default: true,
  },
  systemUpdates: {
    type: Boolean,
    default: true,
  },
  ratingReminder: {
    type: Boolean,
    default: true,
  },
  reviewReceived: {
    type: Boolean,
    default: true,
  },
  accountActivity: {
    type: Boolean,
    default: true,
  },
  successfulReferral: {
    type: Boolean,
    default: true,
  },
  newBadgeReceived: {
    type: Boolean,
    default: true,
  },
  promotional: {
    type: Boolean,
    default: false,
  },
  reminders: {
    type: Boolean,
    default: true,
  },
});

/**
 * @typedef {Object} NotificationSettingSchema
 * @property {import("mongoose").Schema.Types.ObjectId} user - The ID of the user
 * @property {NotificationTypeSettingSchema} inAppNotifications - The in-app notifications settings
 * @property {NotificationTypeSettingSchema} emailNotifications - The email notifications settings
 */
const notificationSettingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  inAppNotifications: notificationTypeSettingSchema,
  emailNotifications: notificationTypeSettingSchema,
});

notificationSettingSchema.plugin(toJSON);

/**
 * @typedef {mongoose.Document & NotificationSettingSchema} NotificationSetting
 */
const NotificationSetting = mongoose.model(
  "NotificationSetting",
  notificationSettingSchema
);

export default NotificationSetting;
