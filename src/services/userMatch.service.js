import UserMatch from "../models/userMatch.model.js";

/**
 * Create a usermatch document
 * @param {UserMatchSchema} userMatchBody
 */
const createUserMatch = async (userMatchBody) => {
  return await UserMatch.create(userMatchBody);
};

/**
 * Get user match by ID
 * @param {string} userMatchId
 */
const getUserMatchById = (userMatchId) => {
  return UserMatch.findById(userMatchId);
}

export default { createUserMatch, getUserMatchById };
  
/**
 * @typedef {import("../models/userMatch.model.js").UserMatchSchema} UserMatchSchema
 */
