import mongoose from "mongoose";

/**
 * @typedef Badge
 * @property {string} name - The name of badge
 * @property {string} description - The description of badge
 * @property {string} icon - The icon of badge
 */
const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
