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

  await updateUser(req.user.id, { profile, email: req.body.email });
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
