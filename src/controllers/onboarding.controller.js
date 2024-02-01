import httpStatus from "http-status";
import {
  generateExpertiseAreasSuggestions,
  generatePrimaryInterestSuggestions,
  generatePracticeAreasSuggestions,
} from "../providers/openai/services/suggestions.js";
import {
  getExpertiseAreasBySearchTerm,
  getPrimaryInterestsBySearchTerm,
  getPracticeAreasBySearchTerm,
  getExpertiseAreasByIds,
  getPrimaryInterestsByIds,
  getPracticeAreasByIds,
  bulkUpsertExpertiseAreas,
  bulkUpsertPrimaryInterests,
  bulkUpsertPracticeAreas,
  getOrUpdateSuggestionsHelper,
} from "../services/suggestions.service.js";

const getPrimaryInterestSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    getBySearchTermFn: getPrimaryInterestsBySearchTerm,
    generateSuggestionsFn: generatePrimaryInterestSuggestions,
    getByIdsFn: getPrimaryInterestsByIds,
    bulkUpsertFn: bulkUpsertPrimaryInterests,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

const getExpertiseAreaSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    getBySearchTermFn: getExpertiseAreasBySearchTerm,
    generateSuggestionsFn: generateExpertiseAreasSuggestions,
    getByIdsFn: getExpertiseAreasByIds,
    bulkUpsertFn: bulkUpsertExpertiseAreas,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

const getPracticeAreaSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    getBySearchTermFn: getPracticeAreasBySearchTerm,
    generateSuggestionsFn: generatePracticeAreasSuggestions,
    getByIdsFn: getPracticeAreasByIds,
    bulkUpsertFn: bulkUpsertPracticeAreas,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

export { getPrimaryInterestSuggestions, getExpertiseAreaSuggestions, getPracticeAreaSuggestions };
