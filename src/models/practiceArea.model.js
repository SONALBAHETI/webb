import mongoose from "mongoose";
import { paginate, toJSON } from "./plugins/index.js";

const practiceAreaSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
});

practiceAreaSchema.index({ title: "text" });

practiceAreaSchema.plugin(toJSON);
practiceAreaSchema.plugin(paginate);

const PracticeArea = mongoose.model(
  "PracticeArea",
  practiceAreaSchema
);

/**
 * @typedef PracticeArea
 */
export default PracticeArea;
