import httpStatus from "http-status";
import {
  generateExpertiseAreasSuggestions,
  generatePrimaryInterestSuggestions,
  generatePracticeAreasSuggestions,
} from "../providers/openai/services/suggestions.js";
import { getOrUpdateSuggestionsHelper } from "../services/suggestion.service.js";
import { updateUser } from "../services/user.service.js";
import { UserObjectives, UserOccupations } from "../constants/onboarding.js";
import { ROLE } from "../config/roles.js";

/**
 * Get suggestions for primary areas of interest based on search term.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @returns The suggestions
 */
const getPrimaryInterestSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    type: "primaryInterest",
    generateSuggestionsFn: generatePrimaryInterestSuggestions,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Get suggestions for areas of expertise based on search term.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @returns The suggestions
 */
const getExpertiseAreaSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    type: "expertiseArea",
    generateSuggestionsFn: generateExpertiseAreasSuggestions,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Get suggestions for areas of practice based on search term.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @returns The suggestions
 */
const getPracticeAreaSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    type: "practiceArea",
    generateSuggestionsFn: generatePracticeAreasSuggestions,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Submit onboarding form and update user details.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @returns The success message
 */
const submitOnboardingForm = async (req, res) => {
  const {
    userOccupation,
    userObjective,
    primaryAreasOfInterest: primaryInterests,
    primaryAreasOfPractice: practiceAreas,
    areasOfExpertise: expertiseAreas,
  } = req.body;
  let role, profile;

  const isHealthcareStudent =
    userOccupation === UserOccupations.HEALTHCARE_STUDENT;
  const isHealthcareProfessional =
    userOccupation === UserOccupations.HEALTHCARE_PROFESSIONAL;
  const isFindAMentor = userObjective === UserObjectives.FIND_A_MENTOR;

  if (isHealthcareStudent || (isHealthcareProfessional && isFindAMentor)) {
    role = ROLE.MENTEE;
    profile = { primaryInterests };
  } else {
    role = ROLE.MENTOR;
    profile = { practiceAreas, expertiseAreas };
  }
  await updateUser(req.user.id, {
    role,
    occupation: userOccupation,
    accountStatus: { isOnboarded: true },
    profile,
  });
  res.status(httpStatus.OK).json({ success: true });
};

export {
  getPrimaryInterestSuggestions,
  getExpertiseAreaSuggestions,
  getPracticeAreaSuggestions,
  submitOnboardingForm,
};
