import mongoose from "mongoose";
import badgeSchema from "./badge.schema.js";
import { Levels } from "../../../constants/levels.js";
import toJSON from "../../plugins/toJSON.plugin.js";

/**
 * @typedef {Object} AchievementsSchema
 * @property {Array<import("./badge.schema.js").BadgeSchema>} badges - The list of badges
 * @property {number} level - The level
 */
const achievementsSchema = new mongoose.Schema({
  badges: {
    type: [badgeSchema],
    default: [],
  },
  level: {
    type: Number,
    min: [0, "Level must be greater than or equal to 0"],
    max: [5, "Level must be less than or equal to 5"],
    default: Levels.Newbie,
  },
});

achievementsSchema.plugin(toJSON);

export default achievementsSchema;