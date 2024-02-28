import { OPENAI_MODELS } from "../models.js";
import {
  autoCompleteSuggestionModel,
  autoCompleteSystemPrompt,
  autoCompleteUserPrompt,
} from "./autoComplete.js";

// The expected JSON format response from the OpenAI API
const religiousAffiliationsResponseFormat = {
  suggestions: ["Hinduism", "Islam", "Christianity", "Buddhism"],
};

// The system prompt for auto-complete suggestions
const religiousAffiliationsSystemPrompt = autoCompleteSystemPrompt({
  fieldName: "religious affiliations",
  filledBy: "user",
  purpose: "understand the user's religious affiliations",
  jsonFormat: religiousAffiliationsResponseFormat,
});

// The user prompt for auto-complete suggestions
const religiousAffiliationsUserPrompt = (searchTerm) =>
  autoCompleteUserPrompt(searchTerm);

// The suggestion model for auto-complete suggestions
const religiousAffiliationsSuggestionModel = ({
  modelName = OPENAI_MODELS.GPT_3_5_TURBO,
  searchTerm,
}) =>
  autoCompleteSuggestionModel({
    modelName,
    systemPrompt: religiousAffiliationsSystemPrompt,
    userPrompt: religiousAffiliationsUserPrompt(searchTerm),
  });

export {
  religiousAffiliationsSystemPrompt,
  religiousAffiliationsUserPrompt,
  religiousAffiliationsSuggestionModel,
};
