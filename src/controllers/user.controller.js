import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import { updateUser } from "../services/user.service.js";

/**
 * Update user details from the sign up onboarding form
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateUserDetailsFromOnboarding = catchAsync(async (req, res) => {
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
  res.status(httpStatus.OK).send({ user });
});

export { updateUserDetailsFromOnboarding };
