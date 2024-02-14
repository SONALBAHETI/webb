import mongoose from "mongoose";

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

const userMatchSchema = new mongoose.Schema({
  requestedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  matches: [matchSchema],
});

/**
 * @typedef UserMatch
 */
const UserMatch = mongoose.model("UserMatch", userMatchSchema);

export default UserMatch;
