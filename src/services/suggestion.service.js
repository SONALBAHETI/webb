import Suggestion from "../models/suggestion.model.js";
import mongoose from "mongoose";

/**
 * Returns a MongoDB query object for searching by title using a case-insensitive regex.
 *
 * @param {string} q - The search query string
 * @param {string} type - The type of suggestion
 * @return {object} MongoDB query object
 */
const getSearchQuery = (q, type) => {
  return { title: { $regex: q, $options: "i" }, type };
};

/**
 * Generates bulk upsert suggestion operations based on the given suggestions.
 *
 * @param {Array<String>} suggestions - The array of suggestions to generate bulk upsert operations for.
 * @param {string} type - The type of suggestion
 * @return An array of bulk upsert suggestion operations.
 */
const getBulkUpsertSuggestionOps = (suggestions, type) => {
  return suggestions.map((suggestion) => {
    return {
      updateOne: {
        filter: { title: suggestion, type },
        update: { $setOnInsert: { title: suggestion, type } },
        upsert: true,
      },
    };
  });
};

/**
 * Find documents in the Model by search term.
 *
 * @param {mongoose.PassportLocalModel<mongoose.Document>} Model - the model to search
 * @param {string} q - the search term
 * @param {string} type - the type of suggestion
 * @param {number} limit - the maximum number of documents to return (default is 10)
 * @return an array of documents that match the search term
 */
const findSuggestionsBySearchTerm = async (q, type, limit = 10) => {
  return await Suggestion.find(getSearchQuery(q, type)).limit(limit).lean();
};

/**
 * Retrieves suggestion documents based on ids.
 *
 * @param {mongoose.PassportLocalModel<mongoose.Document>} Model - The model
 * @param {Array<String>} ids - The primary interest id array
 * @param {string} type - The type of suggestion
 * @return An array of suggestion documents (flat objects)
 */
const getSuggestionsByIds = async (ids, type) => {
  return await Suggestion.find({ _id: { $in: ids }, type }).lean();
};

/**
 * @typedef {import("../types.js").FlattenMapsResult} FlattenMapsResult
 * @typedef {import("../types.js").BulkWriteResult} BulkWriteResult
 * @typedef {import("../types.js").SuggestionType} SuggestionType
 */

/**
 * Asynchronous function to get and update suggestions based on the search term.
 *
 * @param {Object} options - An object containing the following parameters:
 * @param {SuggestionType} options.type - The type of suggestion.
 * @param {string} options.searchTerm - The search term to fetch suggestions for.
 * @param {(q: string) => any} options.generateSuggestionsFn - The function to generate suggestions based on the search term.
 * @return {Promise<FlattenMapsResult[]>} An array of suggestions after updating based on the search term.
 */
const getOrUpdateSuggestionsHelper = async ({
  type,
  searchTerm,
  generateSuggestionsFn,
}) => {
  // Check if there are suggestions in the database for the search term
  const result = await findSuggestionsBySearchTerm(searchTerm, type);
  if (result.length < 3) {
    // If there are less than 3 suggestions in the database, generate more of them
    const aiGeneratedSuggestions = await generateSuggestionsFn(searchTerm);
    if (aiGeneratedSuggestions.suggestions?.length > 0) {
      // Upsert the generated suggestions
      const response = await Suggestion.bulkWrite(
        getBulkUpsertSuggestionOps(aiGeneratedSuggestions.suggestions, type)
      );
      // Get the upserted suggestions
      const upsertedSuggestions = await getSuggestionsByIds(
        Object.values(response.upsertedIds),
        type
      );
      // Add the upserted suggestions to the result
      result.push(...upsertedSuggestions);
    }
  }
  return result;
};

export { getOrUpdateSuggestionsHelper };
