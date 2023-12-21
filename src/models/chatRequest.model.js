import mongoose from "mongoose";
import { toJSON, paginate } from "./plugins/index.js";

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
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
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

/**
 * @typedef ChatRequest
 */
const ChatRequest = mongoose.model("ChatRequest", chatRequestSchema);

export default ChatRequest;
