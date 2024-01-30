import { aboutUsPrompt } from "./aboutUs.js";
import { promptArrayToString } from "./utils.js";

const primaryInterestResponseFormat = {
  suggestions: [
    "physical therapy",
    "nursing",
    "nurse practitioner",
    "physical therapy assistant",
    "physician",
    "education",
    "administration",
  ],
};

const primaryInterestSystemPrompt = promptArrayToString([
  aboutUsPrompt,
  "Your job is to provide auto-complete suggestions for an input field. ",
  "The input field is called 'primary areas of practice/interest' and the learner or mentee will fill it during onboarding to help us match mentors with the learner. ",
  "The values of this field will be related to 'primary areas of practice/interest' only. ",
  "If the user types anything unrelated, return an empty array. ",
  "You must return the response in JSON format. ",
  "The format and example values of the JSON response is as follows: ",
  `${JSON.stringify(primaryInterestResponseFormat)}`,
  "You will return around 5 - 10 suggestions.",
]);

const primaryInterestUserPrompt = (searchTerm) => {
  return `Provide auto-complete suggestions for '${searchTerm}'`;
};

const primaryInterestSuggestionModel = (modelName, searchTerm) => {
  return {
    messages: [
      {
        role: "system",
        content: primaryInterestSystemPrompt,
      },
      { role: "user", content: primaryInterestUserPrompt(searchTerm) },
    ],
    model: modelName,
    response_format: { type: "json_object" },
  };
};

export {
  primaryInterestSystemPrompt,
  primaryInterestUserPrompt,
  primaryInterestSuggestionModel,
};
