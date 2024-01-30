import mongoose from "mongoose";
import { paginate, toJSON } from "./plugins/index.js";

const primaryInterestSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
});

primaryInterestSchema.index({ title: "text" });

primaryInterestSchema.plugin(toJSON);
primaryInterestSchema.plugin(paginate);

const PrimaryInterest = mongoose.model(
  "PrimaryInterest",
  primaryInterestSchema
);

/**
 * @typedef PrimaryInterest
 */
export default PrimaryInterest;
