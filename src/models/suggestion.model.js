import mongoose from "mongoose";

/**
 * @typedef Suggestion
 * @property {string} title - The title of suggestion
 * @property {string} type - The type of suggestion
 */
const suggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

suggestionSchema.index({ title: "text", type: "text" }, { unique: true });

const Suggestion = mongoose.model("Suggestion", suggestionSchema);

/**
 * @typedef {"university" | "boardSpecialty" | "residencyProgram" | "commonlyTreatedDiagnosis" | "primaryInterest" | "expertiseArea" | "practiceArea" | "personalInterest" | "religiousAffiliation"} SuggestionType
 */
export const SuggestionTypes = {
  University: "university",
  BoardSpecialty: "boardSpecialty",
  ResidencyProgram: "residencyProgram",
  CommonlyTreatedDiagnosis: "commonlyTreatedDiagnosis",
  PrimaryInterest: "primaryInterest",
  ExpertiseArea: "expertiseArea",
  PracticeArea: "practiceArea",
  PersonalInterest: "personalInterest",
  ReligiousAffiliation: "religiousAffiliation",
};

export default Suggestion;
