import { createCompletion } from "../api.js";
import { primaryInterestSuggestionModel } from "../prompts/primaryInterests.js";
import { aiResponseToJSON } from "../utils.js";
import { expertiseAreasSuggestionModel } from "../prompts/expertiseAreas.js";
import { practiceAreasSuggestionModel } from "../prompts/practiceAreas.js";

/**
 * Generates primary interest suggestions based on the provided search term.
 *
 * @param {string} searchTerm - The term used to search for primary interest suggestions
 * @return {Promise<Array<String>>} An array of primary interest suggestions
 */
const generatePrimaryInterestSuggestions = async (searchTerm) => {
  const suggestionsStr = await createCompletion(
    primaryInterestSuggestionModel({ searchTerm })
  );
  return aiResponseToJSON(suggestionsStr) || [];
};

/**
 * Generates expertise areas suggestions based on the provided search term.
 *
 * @param {string} searchTerm - The term used to search for expertise areas suggestions
 * @return {Promise<Array<String>>} An array of expertise areas suggestions
 */
const generateExpertiseAreasSuggestions = async (searchTerm) => {
  const suggestionsStr = await createCompletion(
    expertiseAreasSuggestionModel({ searchTerm })
  );
  return aiResponseToJSON(suggestionsStr) || [];
};

/**
 * Generates practice areas suggestions based on the provided search term.
 *
 * @param {string} searchTerm - The term used to search for practice areas suggestions
 * @return {Promise<Array<String>>} An array of practice areas suggestions
 */
const generatePracticeAreasSuggestions = async (searchTerm) => {
  const suggestionsStr = await createCompletion(
    practiceAreasSuggestionModel({ searchTerm })
  );
  return aiResponseToJSON(suggestionsStr) || [];
};

export {
  generatePrimaryInterestSuggestions,
  generateExpertiseAreasSuggestions,
  generatePracticeAreasSuggestions,
};
