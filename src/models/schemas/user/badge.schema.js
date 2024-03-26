import mongoose from "mongoose";
import { toJSON } from "../../plugins/index.js";

/**
 * @typedef {Object} BadgeSchema
 * @property {mongoose.Types.ObjectId} originalBadge - The original badge
 * @property {string} name - The name of the badge
 * @property {string} description - The description of the badge
 * @property {string} icon - The icon of the badge
 */
const badgeSchema = new mongoose.Schema(
  {
    originalBadge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

badgeSchema.plugin(toJSON);

export default badgeSchema;