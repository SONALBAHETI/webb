import mongoose from "mongoose";
import { paginate, toJSON } from "./plugins/index.js";

const expertiseAreaSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
});

expertiseAreaSchema.index({ title: "text" });

expertiseAreaSchema.plugin(toJSON);
expertiseAreaSchema.plugin(paginate);

const ExpertiseArea = mongoose.model(
  "ExpertiseArea",
  expertiseAreaSchema
);

/**
 * @typedef ExpertiseArea
 */
export default ExpertiseArea;
