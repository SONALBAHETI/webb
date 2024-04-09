import httpStatus from "http-status";
import {
  addDegree,
  addCertificate,
  updateUser,
  changeProfilePicture,
} from "../services/user.service.js";
import pick from "../utils/pick.js";
import { getOrUpdateSuggestionsHelper } from "../services/suggestion.service.js";
import {
  generatePersonalInterestsSuggestions,
  generateReligiousAffiliationSuggestions,
  generateCommonlyTreatedDiagnosesSuggestions,
} from "../providers/openai/services/suggestions.js";
import { physicalTherapyDegrees } from "../constants/degrees.js";
import { physicalTherapyUniversities } from "../constants/universities.js";
import {
  fellowshipPrograms,
  residencyPrograms,
} from "../constants/residencyAndFellowshipPrograms.js";
import { SuggestionTypes } from "../models/suggestion.model.js";
import { boardSpecialties } from "../constants/boardSpecialties.js";
import storageService from "../services/storage.service.js";
import { ROLE } from "../config/roles.js";

/**
 * Handles the upload of user's profile picture.
 *
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 */
const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: "No file uploaded" });
  }
  const result = await storageService.uploadFile(req.file, {
    public_id: req.user.id,
    folder: "profile-pics",
    resource_type: "image",
  });
  await changeProfilePicture(req.user.id, result.secure_url);
  return res.status(httpStatus.OK).json({ url: result.secure_url });
};

/**
 * Get Suggestions for Personal Interests based on search term
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @returns The suggestions
 */
const getPersonalInterestsSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    type: SuggestionTypes.PersonalInterest,
    generateSuggestionsFn: generatePersonalInterestsSuggestions,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Get Suggestions for Personal Interests based on search term
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @returns The suggestions
 */
const getReligiousAffiliationsSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    type: SuggestionTypes.ReligiousAffiliation,
    generateSuggestionsFn: generateReligiousAffiliationSuggestions,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Retrieves degree suggestions based on the query parameter.
 *
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @returns an object containing the suggestions
 */
const getDegreeSuggestions = async (req, res) => {
  const { q } = req.query;
  const suggestions = physicalTherapyDegrees.filter((i) =>
    i.toLocaleLowerCase().includes(q.toLocaleLowerCase())
  );
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Retrieves residency program suggestions based on the query parameter.
 *
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @returns an object containing the suggestions
 */
const getResidencyProgramSuggestions = async (req, res) => {
  const { q } = req.query;
  const suggestions = residencyPrograms.filter((i) =>
    i.toLocaleLowerCase().includes(q.toLocaleLowerCase())
  );
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Retrieves fellowship program suggestions based on the query parameter.
 *
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @returns an object containing the suggestions
 */
const getFellowshipProgramSuggestions = async (req, res) => {
  const { q } = req.query;
  const suggestions = fellowshipPrograms.filter((i) =>
    i.toLocaleLowerCase().includes(q.toLocaleLowerCase())
  );
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Retrieves university suggestions based on the query parameter.
 *
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @returns an object containing the suggestions
 */
const getUniversitySuggestions = async (req, res) => {
  const { q } = req.query;
  const suggestions = physicalTherapyUniversities.filter((i) =>
    i.toLocaleLowerCase().includes(q.toLocaleLowerCase())
  );
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Get Suggestions for Commonly Treated Diagnoses based on search type
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 * @return The suggestions
 */
const getCommonlyTreatedDiagnosesSuggestions = async (req, res) => {
  const { q } = req.query;
  const result = await getOrUpdateSuggestionsHelper({
    searchTerm: q,
    type: SuggestionTypes.CommonlyTreatedDiagnosis,
    generateSuggestionsFn: generateCommonlyTreatedDiagnosesSuggestions,
  });
  const suggestions = result.map((i) => i.title);
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Get Suggestions for Board Specialties based on search type
 * @param {import("express").Request}req  - The request object
 * @param {import("express").Response} res - The response object
 * @return The suggestions
 */
const getBoardSpecialtiesSuggestions = async (req, res) => {
  const { q } = req.query;
  const suggestions = boardSpecialties.filter((i) =>
    i.toLocaleLowerCase().includes(q.toLocaleLowerCase())
  );
  res.status(httpStatus.OK).json({ suggestions });
};

/**
 * Get user profile and email from the request object and send it as a JSON response with the OK status.
 * This is meant to be used in the settings page only and not on the public profile pages.
 * It returns some private fields.
 *
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const getUserProfile = async (req, res) => {
  /** @type {import("../models/user.model.js").User} */
  const user = req.user;
  const {
    profile,
    email,
    agreements: { shareExtraDetailsForMatchmaking },
  } = user;

  let userProfile = profile.toJSON();

  // add some private fields because this is a private settings route
  userProfile.identity = profile.identity;
  userProfile.ethnicity = profile.ethnicity;
  userProfile.religiousAffiliations = profile.religiousAffiliations;

  return res.status(httpStatus.OK).json({
    profile: userProfile,
    email,
    shareExtraDetailsForMatchmaking,
  });
};

/**
 * Submit My information form and update user details.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const submitIdentityInformation = async (req, res) => {
  /** @type {import("../models/user.model.js").User} */
  const user = req.user;

  /** @type {Partial<import("../models/schemas/user/profile.schema.js").ProfileSchema>} */
  let profile = pick(req.body, [
    "firstName",
    "lastName",
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

  const { email, shareExtraDetailsForMatchmaking } = req.body;

  // remove extra details if they are not being shared
  if (!shareExtraDetailsForMatchmaking) {
    profile.identity = undefined;
    profile.ethnicity = undefined;
    profile.religiousAffiliations = [];
  }

  // remove postal code if the user is not a mentor
  if (
    user.accessControl.role !== ROLE.MENTOR ||
    user.accessControl.role !== ROLE.UNVERIFIED_MENTOR
  ) {
    profile.postalCode = undefined;
  }

  await updateUser(user.id, {
    profile,
    email,
    agreements: { shareExtraDetailsForMatchmaking },
  });

  return res.status(httpStatus.OK).json({
    success: true,
  });
};

/**
 * Updates the user's education information.
 *
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const submitEducationForm = async (req, res) => {
  const education = pick(req.body, [
    "isResidencyTrained",
    "isFellowshipTrained",
    "residencyPrograms",
    "fellowshipPrograms",
  ]);
  await updateUser(req.user.id, { profile: { education } });
  return res.status(httpStatus.OK).json({
    success: true,
  });
};

/**
 * Updates the user's expertise information.
 *
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const submitExpertiseForm = async (req, res) => {
  const expertise = pick(req.body, [
    "yearsInClinicalPractice",
    "commonlyTreatedDiagnoses",
    "boardSpecialties",
    "expertiseAreas",
    "primaryInterests",
    "practiceAreas",
  ]);
  await updateUser(req.user.id, { profile: { expertise } });
  return res.status(httpStatus.OK).json({
    success: true,
  });
};

/**
 * Adds a new degree to the user's profile.
 *
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const addNewDegree = async (req, res) => {
  const { degreeName, universityName, dateOfCompletion } = req.body;
  await addDegree(req.user.id, {
    name: degreeName,
    institution: universityName,
    dateOfCompletion,
  });
  return res.status(httpStatus.OK).json({
    success: true,
  });
};

/**
 * Adds a new certificate to the user's profile.
 *
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const addNewCertificate = async (req, res) => {
  const { name, dateOfIssue, expirationDate } = req.body;
  await addCertificate(req.user.id, {
    name,
    dateOfIssue,
    expirationDate,
  });
  return res.status(httpStatus.OK).json({
    success: true,
  });
};

export {
  submitIdentityInformation,
  getPersonalInterestsSuggestions,
  getCommonlyTreatedDiagnosesSuggestions,
  getBoardSpecialtiesSuggestions,
  getUserProfile,
  getReligiousAffiliationsSuggestions,
  getDegreeSuggestions,
  getUniversitySuggestions,
  addNewDegree,
  addNewCertificate,
  getResidencyProgramSuggestions,
  getFellowshipProgramSuggestions,
  submitEducationForm,
  submitExpertiseForm,
  uploadProfilePicture,
};
