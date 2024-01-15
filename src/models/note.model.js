import mongoose from "mongoose";
import { toJSON } from "./plugins/index.js";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
noteSchema.plugin(toJSON);

const Note = mongoose.model("Note", noteSchema);

export default Note;
