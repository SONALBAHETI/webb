import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

suggestionSchema.index({ title: "text" });

const Suggestion = mongoose.model("Suggestion", suggestionSchema);

/**
 * @typedef Suggestion
 */
export default Suggestion;
