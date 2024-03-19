import httpStatus from "http-status";
import responseHandler from "../utils/responseHandler.js";
import { updateUser } from "../services/user.service.js";

/**
 * Retrieves the achievements of the logged in user.
 *
 * @param {import("express").Request} req - the request object
 * @param {import("express").Response} res - the response object
 */
const getAchievements = async (req, res) => {
  const achievements = req.user.getAchievements();
  const badges = achievements.badges?.map((badge) => badge.toJSON());
  res.status(httpStatus.OK).send({ achievements: { badges } });
};

/**
 * Checks whether user is online or not
 *
 * @param {import("express").Request} req - the request object
 * @param {import("express").Response} res - the response object
 */
const getVisibility = async (req, res) => {
  res.status(httpStatus.OK).send({ online: req.user.isOnline() });
};

/**
 * Sets users visibility to online or offline
 *
 * @param {import("express").Request} req - the request object
 * @param {import("express").Response} res - the response object
 */
const updateVisibility = async (req, res) => {
  const { online } = req.body;
  await updateUser(req.user.id, { availability: { online } });
  res.status(httpStatus.OK).send({ online });
};

/**
 * Update user details from the sign up onboarding form
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateUserDetailsFromOnboarding = responseHandler(async (req, res) => {
  const { occupation, objective, specialisations, interests } = req.body;

  // Set role based on occupation and platform objective of the new user
  let role = "";
  if (occupation === "Healthcare professional") {
    if (objective === "Mentor others") {
      role = "mentor";
    } else if (objective === "Find a mentor") {
      role = "learner";
    }
  } else if (occupation === "Healthcare learner") {
    role = "learner";
  }

  // check if role is valid
  if (!role) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "Invalid role" });
  }

  // check if specialisations and interests are valid
  if (
    (!specialisations || !specialisations.length) &&
    (!interests || !interests.length)
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "At least one specialisation or interest is required" });
  }

  const updateUserPayload = {
    role,
    specialisations,
    interests,
  };

  const user = await updateUser(req.params.userId, updateUserPayload);
  res.status(httpStatus.OK).send({ user }); // TODO: User.toJSON()
});

export default {
  updateUserDetailsFromOnboarding,
  getAchievements,
  getVisibility,
  updateVisibility,
};
