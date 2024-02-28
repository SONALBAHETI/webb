import { OPENAI_MODELS } from "../models.js";
import {
  autoCompleteSuggestionModel,
  autoCompleteSystemPrompt,
  autoCompleteUserPrompt,
} from "./autoComplete.js";

// The expected JSON format response from the OpenAI API
const commonlyTreatedDiagnosesResponseFormat = {
  suggestions: [
    "Sprains and strains",
    "Fractures",
    "Osteoarthritis",
    "Rheumatoid arthritis",
    "Tendonitis",
    "Bursitis",
    "Stroke (Cerebrovascular Accident)",
    "Spinal Cord Injury",
    "Multiple Sclerosis",
    "Back pain (including disc herniation, sciatica)",
    "Neck pain",
    "Scoliosis",
  ],
};

// The system prompt for auto-complete suggestions
const commonlyTreatedDiagnosesSystemPrompt = autoCompleteSystemPrompt({
  fieldName: "commonly treated diagnoses",
  filledBy: "mentor",
  purpose: "understand mentor's skills and expertise.",
  jsonFormat: commonlyTreatedDiagnosesResponseFormat,
});

// The user prompt for auto-complete suggestions
const commonlyTreatedDiagnosesUserPrompt = (searchTerm) =>
  autoCompleteUserPrompt(searchTerm);

// The suggestion model for auto-complete suggestions
const commonlyTreatedDiagnosesSuggestionModel = ({
  modelName = OPENAI_MODELS.GPT_3_5_TURBO,
  searchTerm,
}) =>
  autoCompleteSuggestionModel({
    modelName,
    systemPrompt: commonlyTreatedDiagnosesSystemPrompt,
    userPrompt: commonlyTreatedDiagnosesUserPrompt(searchTerm),
  });

export {
  commonlyTreatedDiagnosesSystemPrompt,
  commonlyTreatedDiagnosesUserPrompt,
  commonlyTreatedDiagnosesSuggestionModel,
};
