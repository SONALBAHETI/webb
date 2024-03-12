import mongoose from "mongoose";
import { toJSON } from "./plugins/index.js";
import paginate from 'mongoose-paginate-v2';

/**
 * @typedef {"pending" | "accepted" | "rejected"} ChatRequestStatus
 */
const ChatRequestStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
}
Object.freeze(ChatRequestStatus);

/**
* @typedef {Object} ChatRequest
* @property {import("mongoose").Schema.Types.ObjectId} from - The ID of the sender.
* @property {import("mongoose").Schema.Types.ObjectId} to - The ID of the receiver.
* @property {string} message - The message sent in the request.
* @property {ChatRequestStatus} status - The status of the request.
* @property {string} [channelUrl] - The URL of the chat channel.
* @property {number} responseTime - The time it took to respond to the request (in milliseconds).
* @property {Date} createdAt - The date the request was created.
* @property {Date} updatedAt - The date the request was last updated.
*/
const chatRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true, // TODO: Required or Optional?
    },
    status: {
      type: String,
      enum: Object.values(ChatRequestStatus),
      default: ChatRequestStatus.PENDING,
    },
    channelUrl: {
      type: String,
    },
    responseTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
chatRequestSchema.plugin(toJSON);
chatRequestSchema.plugin(paginate);

const ChatRequest = mongoose.model("ChatRequest", chatRequestSchema);

export default ChatRequest;

export { ChatRequestStatus };


