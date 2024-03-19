import { NotificationStatus, notificationSchema } from "../models/notification.model.js";
import processAsync from "../utils/processAsync.js";
import notificationService from "../services/notification.service.js";

/**
 * Notification trigger plugin
 * @param {notificationSchema} schema
 */
const notificationTrigger = (schema) => {

  // post "save" trigger
  schema.post("save", async function (notification) {
    // if notification has not been sent yet, send the notification
    if (notification.status === NotificationStatus.PENDING) {
      // send notification
      processAsync(async () => {
        notificationService.sendNotification(notification);
        // mark notification as sent
        notification.status = NotificationStatus.SENT;
        await notification.save();
      });
    }
  });

};

export default notificationTrigger;
