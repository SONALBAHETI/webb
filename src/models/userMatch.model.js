import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.plugin.js";

/**
 * @typedef {Object} MatchSchema
 * @property {import("mongoose").Types.ObjectId} user 
 * @property {string} name
 * @property {string} picture
 * @property {string} primaryRole
 * @property {number} numOfReviews
 * @property {number} yearsInClinicalPractice
 * @property {string} badge
 * @property {string} state
 * @property {number} responseRate
 * @property {number} score
 */
const matchSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  picture: String,
  primaryRole: String,
  numOfReviews: Number,
  yearsInClinicalPractice: Number,
  badge: String,
  state: String,
  responseRate: Number,
  score: Number,
});

matchSchema.plugin(toJSON);

/**
 * @typedef {Object} UserMatchSchema
 * @property {import("mongoose").Types.ObjectId} requestedBy
 * @property {MatchSchema[]} matches
 */
const userMatchSchema = new mongoose.Schema({
  requestedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  matches: [matchSchema],
}, { timestamps: true });

userMatchSchema.plugin(toJSON);

/**
 * @typedef {UserMatchSchema & import("mongoose").Document} UserMatch
 * @type {import("mongoose").Model<UserMatchSchema, {}, {}, {}, UserMatch>}
 */
const UserMatch = mongoose.model("UserMatch", userMatchSchema);

export default UserMatch;
