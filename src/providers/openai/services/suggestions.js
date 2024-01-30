import { createCompletion } from "../api.js";
import { OPENAI_MODELS } from "../models.js";
import { primaryInterestSuggestionModel } from "../prompts/primaryInterests.js";
import logger from "../../../config/logger.js";

/**
 * Asynchronously retrieves primary interest suggestions based on the provided search term.
 *
 * @param {string} searchTerm - The term used to search for primary interest suggestions
 * @return {Promise<Array<String>>} An array of primary interest suggestions
 */
const getPrimaryInterestSuggestions = async (searchTerm) => {
  const suggestionsStr = await createCompletion(
    primaryInterestSuggestionModel(OPENAI_MODELS.GPT_3_5_TURBO, searchTerm)
  );
  let suggestions = [];
  if (suggestionsStr) {
    try {
      suggestions = JSON.parse(suggestionsStr);
    } catch (error) {
      // log error and return empty array
      logger.error(`Error parsing openai suggestions: ${error}`);
    }
  }
  return suggestions;
};

export { getPrimaryInterestSuggestions };
