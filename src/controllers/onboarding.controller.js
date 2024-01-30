import httpStatus from "http-status";
import { getPrimaryInterestSuggestions } from "../providers/openai/services/suggestions.js";
import {
  bulkUpsertPrimaryInterests,
  queryPrimaryInterests,
} from "../services/onboarding.service.js";

const getPrimaryInterests = async (req, res) => {
  const { q, page = 1 } = req.query;
  const query = {
    title: { $regex: q, $options: "i" },
    // $text: { $search: q }, // TODO: use this when we have a better index
  };
  const options = { page, limit: 10 };
  let result = await queryPrimaryInterests(query, options);
  if (result.totalDocs < 3) {
    const aiGeneratedInterests = await getPrimaryInterestSuggestions(q);
    if (aiGeneratedInterests.suggestions?.length > 0) {
      // this prevents duplicate inserts
      await bulkUpsertPrimaryInterests(aiGeneratedInterests.suggestions);
      result = await queryPrimaryInterests(query, options);
    }
  }
  res.status(httpStatus.OK).json(result);
};

export { getPrimaryInterests };
