import UserMatch from "../models/userMatch.model.js";

/**
 * Create a usermatch document
 * @param {Object} userMatchBody
 */
const createUserMatch = async (userMatchBody) => {
  return await UserMatch.create(userMatchBody);
};

/**
 * Get user match by ID
 * @param {string} userMatchId
 * @return UserMatch document
 */
const getUserMatchById = async (userMatchId) => {
  return await UserMatch.findById(userMatchId);
}

export { createUserMatch, getUserMatchById };
