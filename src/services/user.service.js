import httpStatus from "http-status";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { Document } from "mongoose";
import deepMerge from "../utils/deepMerge.js";
import { USER_TAG_FIELDS } from "../constants/userTagFields.js";

/**
 * Create a user
 * @param {Object} userBody
 * @throws {ApiError} If email already exists
 * @return {Promise<Document<User>>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.CONFLICT, "Email is already taken!");
  }
  return User.create(userBody);
};

/**
 * Get user by email
 * @param {string} email
 * @return {Promise<Document<User> | null>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Retrieves users by their IDs.
 *
 * @param {Array<string>} userIds - An array of user IDs.
 */
const getUsersById = (userIds) => {
  return User.find({ _id: { $in: userIds } });
};

/**
 * Get user by id
 * @param {ObjectId} id
 */
const getUserById = (id) => {
  return User.findById(id);
};

/**
 * Retrieve a user by their Sendbird ID.
 * @param {string} sendbirdUserId - The Sendbird ID of the user to retrieve
 */
const getUserBySendbirdId = (sendbirdUserId) =>
  User.findOne({ "integrations.sendbird.userId": sendbirdUserId });

/**
 * Updates a user's information.
 *
 * @param {string} userId - The ID of the user to be updated.
 * @param {Object} updateBody - The object containing the updated user information.
 * @throws {ApiError} If the user is not found or if the email is already taken.
 * @return The updated user object.
 */
const updateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.CONFLICT, "Email already taken");
  }
  deepMerge(user, updateBody);
  await user.save();
  return user;
};

/**
 * Updates the OpenAI thread ID for a user.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {string} threadId - The new OpenAI thread ID.
 * @throws {ApiError} If userId or threadId is missing.
 * @returns The updated user object.
 */
const updateOpenAIThreadId = async (userId, threadId) => {
  if (!userId || !threadId) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Missing userId or threadId"
    );
  }
  const user = await updateUser(userId, {
    integrations: {
      openai: {
        threadId: threadId,
      },
    },
  });
  return user;
};

/**
 * Adds a degree to the user's education profile.
 *
 * @param {string} userId - The ID of the user.
 * @param {import("../models/user.model.js").Degree} degree - The degree to be added to the user's education profile.
 * @return A Promise that resolves to the updated user object.
 */
const addDegree = async (userId, degree) => {
  const user = await getUserById(userId);

  return await updateUser(userId, {
    profile: {
      education: {
        degrees: [...(user.profile?.education?.degrees || []), degree],
      },
    },
  });
};

/**
 * Adds a certificate to the user's education profile.
 *
 * @param {string} userId - The ID of the user.
 * @param {import("../models/user.model.js").Certificate} certificate - The certificate to be added to the user's education profile.
 * @return A Promise that resolves to the updated user object.
 */
const addCertificate = async (userId, certificate) => {
  const user = await getUserById(userId);

  return await updateUser(userId, {
    profile: {
      education: {
        certificates: [
          ...(user.profile?.education?.certificates || []),
          certificate,
        ],
      },
    },
  });
};

/**
 * Updates the user's profile picture with the provided picture.
 *
 * @param {string} userId - The ID of the user
 * @param {string} picture - The new profile picture
 * @return A Promise that resolves to the updated user object
 */
const changeProfilePicture = async (userId, picture) => {
  return await updateUser(userId, {
    profile: {
      picture,
    },
  });
};

/**
 * Generates tags based on user information.
 *
 * @param {import("mongoose").Document<User>} user - the user object containing information
 * @return {Array<string>} the array of unique tags generated from the user information
 */
const generateTags = (user) => {
  const degrees = user.getDegrees().map((degree) => degree.name);
  const occupation = user.occupation;
  const primaryRole = user.getPrimaryRole();
  const gender = user.getGender();
  const ethnicity = user.getEthnicity();
  const identity = user.getIdentity();
  const pronouns = user.getPronouns();
  const religiousAffiliations = user.getReligiousAffiliations();
  const certificates = user
    .getCertifications()
    .map((certificate) => certificate.name);
  const commonlyTreatedDiagnoses = user.getCommonlyTreatedDiagnoses();
  const boardSpecialties = user.getBoardSpecialties();
  const expertiseAreas = user.getExpertiseAreas();
  const areasOfPractice = user.getPracticeAreas();
  const areasOfInterest = user.getPrimaryInterests();
  const personalInterests = user.getPersonalInterests();

  const tags = new Set([
    ...degrees,
    occupation,
    primaryRole,
    gender,
    identity,
    pronouns,
    ethnicity,
    ...religiousAffiliations,
    ...certificates,
    ...commonlyTreatedDiagnoses,
    ...boardSpecialties,
    ...expertiseAreas,
    ...areasOfPractice,
    ...areasOfInterest,
    ...personalInterests,
  ]);

  // Remove null and undefined values from the set
  tags.forEach((value) => {
    if (value === null || value === undefined) {
      tags.delete(value);
    }
  });

  return Array.from(tags);
};

/**
 * Checks if any of the tag fields in the user object has been modified.
 *
 * @param {import("mongoose").Document} user - the user object to check
 * @return {boolean} true if any tag field has been modified, false otherwise
 */
const isTagFieldModified = (user) => {
  for (const field of Object.values(USER_TAG_FIELDS)) {
    if (user.isModified(field)) {
      return true;
    }
  }
  return false;
};

export {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateOpenAIThreadId,
  generateTags,
  isTagFieldModified,
  addDegree,
  addCertificate,
  changeProfilePicture,
  getUserBySendbirdId,
  getUsersById,
};
