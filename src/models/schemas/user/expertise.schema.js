import mongoose from "mongoose";

/**
 * @typedef {Object} ExpertiseSchema
 * @property {number} [yearsInClinicalPractice] - The number of years in clinical practice
 * @property {Array<string>} commonlyTreatedDiagnoses - The list of commonly treated diagnoses
 * @property {Array<string>} boardSpecialties - The list of board specialties
 * @property {Array<string>} expertiseAreas - The list of expertise areas
 * @property {Array<string>} practiceAreas - The list of practice areas
 */
const expertiseSchema = new mongoose.Schema({
  yearsInClinicalPractice: Number,
  commonlyTreatedDiagnoses: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  boardSpecialties: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  expertiseAreas: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  practiceAreas: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
});

export default expertiseSchema;