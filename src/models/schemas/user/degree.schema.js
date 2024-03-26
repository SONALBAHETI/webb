import mongoose from "mongoose";

/**
 * @typedef {Object} DegreeSchema
 * @property {string} name - The name of the degree
 * @property {string} institution - The name of the institution
 * @property {Date} dateOfCompletion - The date of completion
 */
const degreeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfCompletion: {
    type: Date,
    required: true,
  },
});

export default degreeSchema;