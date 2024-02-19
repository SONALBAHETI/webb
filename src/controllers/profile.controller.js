import httpStatus from "http-status";
import { updateUser } from "../services/user.service.js";

/**
 * Submit My information form and update user details.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @returns {import("express").Response} The success message
 */
const submitMyInformation = async (req, res) => {
  try {
    // const { userId } = req.user.id;

    const {
      firstName,
      lastName,
      email,
      pronouns,
      gender,
      dateOfBirth,
      state,
      postalCode,
      bio,
      personalInterests,
      yearsOfExperience,
      areasOfExpertise,
      targetedDiagnoses,
      areasOfPractice,
      boardSpecialties,
      ethnicity,
      identity,
    } = req.body;

    const expertise = {
      personalInterests,
      yearsInClinicalPractice: yearsOfExperience,
      expertiseAreas: areasOfExpertise,
      commonlyTreatedDiagnoses: targetedDiagnoses,
      practiceAreas: areasOfPractice,
      boardSpecialties,
    };

    const profile = {
      firstName,
      lastName,
      email,
      pronouns,
      gender,
      dateOfBirth,
      state,
      postalCode,
      bio,
      expertise,
      ethnicity,
      identity,
    };

    const updatedUser = await updateUser("65cf6660eb299689df4f9a4d", { profile });

    return res.status(httpStatus.OK).json({
      success: true,
      message: "User information updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error" });
  }
};

export { submitMyInformation };
