import mongoose from "mongoose";
import { paginate, toJSON } from "./plugins/index.js";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String, require: true },
    type: { type: String, required: true },
    content: String,
    metadata: { type: Object, default: {} },
    read: { type: Boolean, default: false },
    actions: {
      type: [
        {
          text: { type: String, require: true },
          icon: String,
          type: { type: String, require: true },
          link: String,
          action: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

/**
 * @typedef Notification
 */
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
