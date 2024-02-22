import httpStatus from "http-status";
import { updateUser } from "../services/user.service.js";
import pick from "../utils/pick.js";
import { getOrUpdateSuggestionsHelper } from "../services/suggestion.service.js";
import {
  generatePersonalInterestsSuggestions,
  generateReligiousAffiliationSuggestions,
} from "../providers/openai/services/suggestions.js";

/**
 * Get Suggestions for Personal Interests based on search term
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @return The suggestions
 */
const getPersonalInterestsSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    type: "personalInterest",
    generateSuggestionsFn: generatePersonalInterestsSuggestions,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Get Suggestions for Personal Interests based on search term
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @return The suggestions
 */
const getReligiousAffiliationsSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    type: "religiousAffiliation",
    generateSuggestionsFn: generateReligiousAffiliationSuggestions,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Get Suggestions for Commonly Treated Diagnoses based on search type
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @return The suggestions
 */
const getCommonlyTreatedDiagnosesSuggestions = async (req, res) => {
  // TODO:
};

/**
 * Get Suggestions for Board Specialties based on search type
 * @param {import("express").Request}req  - The request object
 * @param {import("express").Response} res - The response object
 * @return The suggestions
 */
const getBoardSpecialtiesSuggestions = async (req, res) => {
  // Function Pending
  //TODO: Similar to the approach used in the onboarding process
};

/**
 * Get user profile and email from the request object and send it as a JSON response with the OK status.
 *
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const getUserProfile = async (req, res) => {
  const { profile, email } = req.user;
  return res.status(httpStatus.OK).json({ profile: profile.toJSON(), email });
};

/**
 * Submit My information form and update user details.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const submitIdentityInformation = async (req, res) => {
  const profile = pick(req.body, [
    "firstName",
    "lastName",
    // "picture", // TODO: Add profile picture
    "pronouns",
    "gender",
    "dateOfBirth",
    "state",
    "postalCode",
    "bio",
    "funFact",
    "personalInterests",
    "identity",
    "ethnicity",
    "religiousAffiliations",
  ]);

  const { email } = req.body;

  await updateUser(req.user.id, { profile, email });

  return res.status(httpStatus.OK).json({
    success: true,
    message: "User information updated successfully",
  });
};

export {
  submitIdentityInformation,
  getPersonalInterestsSuggestions,
  getCommonlyTreatedDiagnosesSuggestions,
  getBoardSpecialtiesSuggestions,
  getUserProfile,
  getReligiousAffiliationsSuggestions,
};
