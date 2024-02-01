import ExpertiseArea from "../models/expertiseArea.model.js";
import PrimaryInterest from "../models/primaryInterest.model.js";
import PracticeArea from "../models/practiceArea.model.js";
import mongoose from "mongoose";

/**
 * Returns a MongoDB query object for searching by title using a case-insensitive regex.
 *
 * @param {string} q - The search query string
 * @return {object} MongoDB query object
 */
const getSearchQuery = (q) => {
  return { title: { $regex: q, $options: "i" } };
};

/**
 * Generates bulk upsert suggestion operations based on the given suggestions.
 *
 * @param {Array<String>} suggestions - The array of suggestions to generate bulk upsert operations for.
 * @return An array of bulk upsert suggestion operations.
 */
const getBulkUpsertSuggestionOps = (suggestions) => {
  return suggestions.map((suggestion) => {
    return {
      updateOne: {
        filter: { title: suggestion },
        update: { $setOnInsert: { title: suggestion } },
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
 * @param {number} limit - the maximum number of documents to return (default is 10)
 * @return an array of documents that match the search term
 */
const findDocumentsBySearchTerm = async (Model, q, limit = 10) => {
  const result = await Model.find(getSearchQuery(q)).limit(limit).lean();
  return result;
};

/**
 * Retrieves primary interests based on search term.
 *
 * @param {Object} options - The options object
 * @param {string} options.q - The search term
 * @param {number} [options.limit=10] - The maximum number of results to return. Default = 10
 * @return An array of primary interests (flat objects)
 */
const getPrimaryInterestsBySearchTerm = async ({ q, limit = 10 }) => {
  return await findDocumentsBySearchTerm(PrimaryInterest, q, limit);
};

/**
 * Retrieves expertise areas based on search term.
 *
 * @param {Object} options - The options object
 * @param {string} options.q - The search term
 * @param {number} [options.limit=10] - The maximum number of results to return. Default = 10
 * @return An array of expertise areas (flat objects)
 */
const getExpertiseAreasBySearchTerm = async ({ q, limit = 10 }) => {
  return await findDocumentsBySearchTerm(ExpertiseArea, q, limit);
};

/**
 * Retrieves practice areas based on search term.
 *
 * @param {Object} options - The options object
 * @param {string} options.q - The search term
 * @param {number} [options.limit=10] - The maximum number of results to return. Default = 10
 * @return An array of practice areas (flat objects)
 */
const getPracticeAreasBySearchTerm = async ({ q, limit = 10 }) => {
  return await findDocumentsBySearchTerm(PracticeArea, q, limit);
};

/**
 * Retrieves primary interests based on ids.
 *
 * @param {Array<String>} ids - The primary interest id array
 * @return An array of primary interests (flat objects)
 */
const getPrimaryInterestsByIds = async (ids) => {
  const result = await PrimaryInterest.find({ _id: { $in: ids } }).lean();
  return result;
};

/**
 * Retrieves expertise areas based on ids.
 *
 * @param {Array<String>} ids - The expertise area id array
 * @return An array of expertise areas (flat objects)
 */
const getExpertiseAreasByIds = async (ids) => {
  const result = await ExpertiseArea.find({ _id: { $in: ids } }).lean();
  return result;
};

/**
 * Retrieves practice areas based on ids.
 *
 * @param {Array<String>} ids - The practice area id array
 * @return An array of practice areas (flat objects)
 */
const getPracticeAreasByIds = async (ids) => {
  const result = await PracticeArea.find({ _id: { $in: ids } }).lean();
  return result;
};

/**
 * Upserts multiple primary interests into the database.
 *
 * @param {Array<String>} interests - The array of primary interests to upsert.
 * @return A promise that resolves to the result of the bulk write operation.
 */
const bulkUpsertPrimaryInterests = async (interests) => {
  return await PrimaryInterest.bulkWrite(getBulkUpsertSuggestionOps(interests));
};

/**
 * Upserts multiple expertise areas into the database.
 *
 * @param {Array<String>} expertiseAreas - The array of expertise areas to upsert.
 * @return A promise that resolves to the result of the bulk write operation.
 */
const bulkUpsertExpertiseAreas = async (expertiseAreas) => {
  return await ExpertiseArea.bulkWrite(
    getBulkUpsertSuggestionOps(expertiseAreas)
  );
};

/**
 * Upserts multiple practice areas into the database.
 *
 * @param {Array<String>} practiceAreas - The array of practice areas to upsert.
 * @return A promise that resolves to the result of the bulk write operation.
 */
const bulkUpsertPracticeAreas = async (practiceAreas) => {
  return await PracticeArea.bulkWrite(
    getBulkUpsertSuggestionOps(practiceAreas)
  );
};

/**
 * @typedef {import("../types.js").FlattenMapsResult} FlattenMapsResult
 * @typedef {import("../types.js").BulkWriteResult} BulkWriteResult
 */

/**
 * Asynchronous function to get and update suggestions based on the search term.
 *
 * @param {Object} options - An object containing the following parameters:
 * @param {string} options.searchTerm - The search term to fetch suggestions for.
 * @param {({ q, limit }: { q: string; limit?: number }) => Promise<FlattenMapsResult[]>} options.getBySearchTermFn - The function to get suggestions based on the search term.
 * @param {(q: string) => any} options.generateSuggestionsFn - The function to generate suggestions based on the search term.
 * @param {(ids: string[]) => Promise<FlattenMapsResult[]>} options.getByIdsFn - The function to get suggestions by their IDs.
 * @param {(suggestions: string[]) => Promise<BulkWriteResult>} options.bulkUpsertFn - The function to bulk upsert suggestions.
 * @return {Promise<FlattenMapsResult[]>} An array of suggestions after updating based on the search term.
 */
const getOrUpdateSuggestionsHelper = async ({
  searchTerm,
  getBySearchTermFn,
  generateSuggestionsFn,
  getByIdsFn,
  bulkUpsertFn,
}) => {
  const result = await getBySearchTermFn({ q: searchTerm });
  if (result.length < 3) {
    const aiGeneratedSuggestions = await generateSuggestionsFn(searchTerm);
    if (aiGeneratedSuggestions.suggestions?.length > 0) {
      const response = await bulkUpsertFn(aiGeneratedSuggestions.suggestions);
      const upsertedSuggestions = await getByIdsFn(
        Object.values(response.upsertedIds)
      );
      result.push(...upsertedSuggestions);
    }
  }
  return result;
};

export {
  getPrimaryInterestsBySearchTerm,
  getExpertiseAreasBySearchTerm,
  getPracticeAreasBySearchTerm,
  getPrimaryInterestsByIds,
  getExpertiseAreasByIds,
  getPracticeAreasByIds,
  bulkUpsertPrimaryInterests,
  bulkUpsertExpertiseAreas,
  bulkUpsertPracticeAreas,
  getOrUpdateSuggestionsHelper,
};
