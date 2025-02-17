import { OPENAI_MODELS } from "../models.js";
import {
  autoCompleteSuggestionModel,
  autoCompleteSystemPrompt,
  autoCompleteUserPrompt,
} from "./autoComplete.js";

// The expected JSON format response from the OpenAI API
const primaryInterestResponseFormat = {
  suggestions: [
    "Nursing",
    "Education",
    "Administration",
    "Cardiovascular System",
    "Pulmonary System",
    "Inpatient Rehabilitation",
    "Geriatrics",
    "Aging",
    "Pedagogy",
    "Research",
  ],
};

// The system prompt for auto-complete suggestions
const primaryInterestSystemPrompt = autoCompleteSystemPrompt({
  fieldName: "primary areas of interests",
  purpose: "understand mentees' primary interests related to physical therapy",
  jsonFormat: primaryInterestResponseFormat,
});

// The user prompt for auto-complete suggestions
const primaryInterestUserPrompt = (searchTerm) =>
  autoCompleteUserPrompt(searchTerm);

// The suggestion model for auto-complete suggestions
const primaryInterestSuggestionModel = ({
  modelName = OPENAI_MODELS.GPT_3_5_TURBO,
  searchTerm,
}) =>
  autoCompleteSuggestionModel({
    modelName,
    systemPrompt: primaryInterestSystemPrompt,
    userPrompt: primaryInterestUserPrompt(searchTerm),
  });

export {
  primaryInterestSystemPrompt,
  primaryInterestUserPrompt,
  primaryInterestSuggestionModel,
};
