import { aboutUsPrompt } from "./aboutUs.js";
import { promptArrayToString } from "./utils.js";

/**
 * Generates the system prompt for auto-complete suggestions.
 * @param {Object} options
 * @param {string} options.fieldName - The name of the input field.
 * @param {string} options.filledBy - The entity that will fill the input field.
 * @param {string} options.purpose - The purpose of the input field.
 * @param {Object} options.jsonFormat - The format of the JSON response.
 * @returns {string} The system prompt for auto-complete suggestions.
 */
export const autoCompleteSystemPrompt = ({
  fieldName,
  filledBy = "mentee",
  purpose = "match mentees with the right mentors",
  jsonFormat,
}) =>
  promptArrayToString([
    aboutUsPrompt,
    `Your job is to provide auto-complete suggestions for an input field`,
    `The input field is called '${fieldName}' and the ${filledBy} will fill it to help us ${purpose}`,
    `The values of this field will be related to '${fieldName}' only and will include the search term`,
    `If the user types anything unrelated apart from spelling mistakes, return an empty array`,
    `You must return the response in JSON format`,
    `The format and a few example values of the JSON response is as follows:`,
    `${JSON.stringify(jsonFormat)}`,
    `You will return around 5 - 10 suggestions.`,
  ]);

/**
 * Generates the user prompt for auto-complete suggestions.
 * @param {string} searchTerm - The search term entered by the user.
 * @returns {string} The user prompt for auto-complete suggestions.
 */
export const autoCompleteUserPrompt = (searchTerm) => {
  return `Provide auto-complete suggestions for search term: '${searchTerm}'`;
};

/**
 * Generates the suggestion model for auto-complete suggestions.
 * @param {Object} options
 * @param {string} options.modelName - The name of the model.
 * @param {string} options.systemPrompt - The system prompt for auto-complete suggestions.
 * @param {string} options.userPrompt - The user prompt for auto-complete suggestions.
 * @returns The suggestion model for auto-complete suggestions.
 */
export const autoCompleteSuggestionModel = ({
  modelName = OPENAI_MODELS.GPT_3_5_TURBO,
  systemPrompt,
  userPrompt,
}) => {
  return {
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      { role: "user", content: userPrompt },
    ],
    model: modelName,
    response_format: { type: "json_object" },
  };
};
