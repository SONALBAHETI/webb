import { OPENAI_MODELS } from "../models.js";
import {
  autoCompleteSuggestionModel,
  autoCompleteSystemPrompt,
  autoCompleteUserPrompt,
} from "./autoComplete.js";

// The expected JSON format response from the OpenAI API
const personalInterestsResponseFormat = {
  suggestions: [
    "Reading",
    "Cooking",
    "Traveling",
    "Photography",
    "Hiking",
    "Gardening",
    "Painting",
    "Playing musical instruments",
    "Watching movies",
    "Writing",
    "Exercising",
    "Dancing",
  ],
};

// The system prompt for auto-complete suggestions
const personalInterestsSystemPrompt = autoCompleteSystemPrompt({
  fieldName: "personal interests",
  filledBy: "user",
  purpose: "understand the user's personal interests",
  jsonFormat: personalInterestsResponseFormat,
});

// The user prompt for auto-complete suggestions
const personalInterestsUserPrompt = (searchTerm) =>
  autoCompleteUserPrompt(searchTerm);

// The suggestion model for auto-complete suggestions
const personalInterestsSuggestionModel = ({
  modelName = OPENAI_MODELS.GPT_3_5_TURBO,
  searchTerm,
}) =>
  autoCompleteSuggestionModel({
    modelName,
    systemPrompt: personalInterestsSystemPrompt,
    userPrompt: personalInterestsUserPrompt(searchTerm),
  });

export {
  personalInterestsSystemPrompt,
  personalInterestsUserPrompt,
  personalInterestsSuggestionModel,
};
