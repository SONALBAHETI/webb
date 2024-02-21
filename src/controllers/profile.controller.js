import httpStatus from "http-status";
import { updateUser } from "../services/user.service.js";
import pick from "../utils/pick.js";

/**
 * Get Suggestions for Commonly Diagnoses based on search type
 * @param {import("express").Request}req  - The request object
 * @param {import("express").Response} res - The response object
 * @return The suggestions
 */

const getCommonlyDiagnoses = async (req, res) => {
  // Function Pending
  //TODO: Similar to the approach used in the onboarding process
};

/**
 * Get Suggestions for Board Specialties based on search type
 * @param {import("express").Request}req  - The request object
 * @param {import("express").Response} res - The response object
 * @return The suggestions
 */

const getBoardSpecialties = async (req, res) => {
  // Function Pending
  //TODO: Similar to the approach used in the onboarding process
};

/**
 * Submit My information form and update user details.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @returns {import("express").Response} The success message
 */
const submitMyInformation = async (req, res) => {
  const {
    firstName,
    lastName,
    picture,
    bio,
    primaryRole,
    pronouns,
    gender,
    identity,
    ethnicity,
    personalInterests,
    religiousAffiliations,
    education,
    expertise,
  } = req.body;

  const profile = pick(req.body, [
    "firstName",
    "lastName",
    "picture",
    "bio",
    "primaryRole",
    "pronouns",
    "gender",
    "identity",
    "ethnicity",
    "personalInterests",
    "religiousAffiliations",
    "education",
    "expertise",
  ]);

  const userId = "65d344307df1c00481aa93f8";

  await updateUser(userId, { profile: profile });
  return res.status(httpStatus.OK).json({
    success: true,
    message: "User information updated successfully",
  });
};

export { submitMyInformation , getCommonlyDiagnoses , getBoardSpecialties};
