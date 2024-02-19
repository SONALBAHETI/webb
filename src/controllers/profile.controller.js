import httpStatus from "http-status";
import { updateUser } from "../services/user.service.js";

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

  const profile = {
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
  };
  const userId = "65d344307df1c00481aa93f8"; // Replace with actual user ID
  await updateUser(userId, { profile: profile });
  return res.status(httpStatus.OK).json({
    success: true,
    message: "User information updated successfully",
  });
};

export { submitMyInformation };
