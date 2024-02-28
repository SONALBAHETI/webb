import { createCompletion } from "../api.js";
import { primaryInterestSuggestionModel } from "../prompts/primaryInterests.js";
import { aiResponseToJSON } from "../utils.js";
import { expertiseAreasSuggestionModel } from "../prompts/expertiseAreas.js";
import { practiceAreasSuggestionModel } from "../prompts/practiceAreas.js";
import { personalInterestsSuggestionModel } from "../prompts/personalInterests.js";
import { religiousAffiliationsSuggestionModel } from "../prompts/religiousAffiliations.js";
import { commonlyTreatedDiagnosesSuggestionModel } from "../prompts/commonlyTreatedDiagnoses.js";

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
 * Generates personal interest suggestions based on the provided search term.
 *
 * @param {string} searchTerm - The term used to search for personal interest suggestions
 * @return {Promise<Array<String>>} An array of personal interest suggestions
 */
const generatePersonalInterestsSuggestions = async (searchTerm) => {
  const suggestionsStr = await createCompletion(
    personalInterestsSuggestionModel({ searchTerm })
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
 * Generates Commonly Treated Diagnoses suggestions based on the provided search term.
 *
 * @param {string} searchTerm - The term used to search for Commonly Treated Diagnoses suggestions
 * @return {Promise<Array<String>>} An array of Commonly Treated Diagnoses suggestions
 */
const generateCommonlyTreatedDiagnosesSuggestions = async (searchTerm) => {
  const suggestionsStr = await createCompletion(
    commonlyTreatedDiagnosesSuggestionModel({ searchTerm })
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

/**
 * Generates religious affiliation suggestions based on the provided search term.
 *
 * @param {string} searchTerm - The term used to search for religious affiliation suggestions
 * @return {Promise<Array<String>>} An array of religious affiliation suggestions
 */
const generateReligiousAffiliationSuggestions = async (searchTerm) => {
  const suggestionsStr = await createCompletion(
    religiousAffiliationsSuggestionModel({ searchTerm })
  );
  return aiResponseToJSON(suggestionsStr) || [];
};

export {
  generatePrimaryInterestSuggestions,
  generatePersonalInterestsSuggestions,
  generateExpertiseAreasSuggestions,
  generatePracticeAreasSuggestions,
  generateReligiousAffiliationSuggestions,
  generateCommonlyTreatedDiagnosesSuggestions,
};
