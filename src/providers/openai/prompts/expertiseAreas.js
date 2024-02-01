import { OPENAI_MODELS } from "../models.js";
import {
  autoCompleteSuggestionModel,
  autoCompleteSystemPrompt,
  autoCompleteUserPrompt,
} from "./autoComplete.js";

// The expected JSON format response from the OpenAI API
const expertiseAreasResponseFormat = {
  suggestions: [
    "Cardiovascular System",
    "Pulmonary System",
    "Inpatient Rehabilitation",
    "Geriatrics",
    "Aging",
    "Education",
    "Pedagogy",
    "Research",
  ],
};

// The system prompt for auto-complete suggestions
const expertiseAreasSystemPrompt = autoCompleteSystemPrompt({
  fieldName: "expertise areas",
  filledBy: "mentor",
  purpose: "understand areas where the mentor is an expert",
  jsonFormat: expertiseAreasResponseFormat,
});

// The user prompt for auto-complete suggestions
const expertiseAreasUserPrompt = (searchTerm) =>
  autoCompleteUserPrompt(searchTerm);

// The suggestion model for auto-complete suggestions
const expertiseAreasSuggestionModel = ({
  modelName = OPENAI_MODELS.GPT_3_5_TURBO,
  searchTerm,
}) =>
  autoCompleteSuggestionModel({
    modelName,
    systemPrompt: expertiseAreasSystemPrompt,
    userPrompt: expertiseAreasUserPrompt(searchTerm),
  });

export {
  expertiseAreasSystemPrompt,
  expertiseAreasUserPrompt,
  expertiseAreasSuggestionModel,
};
