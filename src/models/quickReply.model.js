import mongoose from "mongoose";
import { toJSON } from "./plugins/index.js";

/**
 * @typedef {"schedule-appointment" | "custom"} QuickReplyType
 */
export const QuickReplyType = {
  SCHEDULE_APPOINTMENT: "schedule-appointment",
  CUSTOM: "custom",
};

/**
 * @typedef {Object} QuickReplySchema
 * @property {import("mongoose").Schema.Types.ObjectId} user - The ID of the user who created the quick reply.
 * @property {QuickReplyType} type - The type of the quick reply.
 * @property {string} title - The title of the quick reply.
 * @property {string} text - The text of the quick reply.
 * @property {Object} metadata - The metadata of the quick reply.
 * @property {string} [shortcut] - The shortcut of the quick reply.
 */
const quickReplySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(QuickReplyType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
    shortcut: {
      type: String,
    },
  },
  { timestamps: true }
);

quickReplySchema.plugin(toJSON);

/**
 * @typedef {mongoose.Document & QuickReplySchema} QuickReply
 */
const QuickReply = mongoose.model("QuickReply", quickReplySchema);

export default QuickReply;
