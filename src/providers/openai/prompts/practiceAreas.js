import { OPENAI_MODELS } from "../models.js";
import {
  autoCompleteSuggestionModel,
  autoCompleteSystemPrompt,
  autoCompleteUserPrompt,
} from "./autoComplete.js";

// The expected JSON format response from the OpenAI API
const practiceAreasResponseFormat = {
  suggestions: [
    "Physical Therapist",
    "Doctor",
    "Nurse",
    "Physical Therapy Assistant",
    "Physician",
    "Educator",
    "Researcher",
    "Speech Language Pathologist",
  ],
};

// The system prompt for auto-complete suggestions
const practiceAreasSystemPrompt = autoCompleteSystemPrompt({
  fieldName: "practice areas",
  filledBy: "mentor",
  purpose: "understand what is the mentor's primary practice.",
  jsonFormat: practiceAreasResponseFormat,
});

// The user prompt for auto-complete suggestions
const practiceAreasUserPrompt = (searchTerm) =>
  autoCompleteUserPrompt(searchTerm);

// The suggestion model for auto-complete suggestions
const practiceAreasSuggestionModel = ({
  modelName = OPENAI_MODELS.GPT_3_5_TURBO,
  searchTerm,
}) =>
  autoCompleteSuggestionModel({
    modelName,
    systemPrompt: practiceAreasSystemPrompt,
    userPrompt: practiceAreasUserPrompt(searchTerm),
  });

export {
  practiceAreasSystemPrompt,
  practiceAreasUserPrompt,
  practiceAreasSuggestionModel,
};
