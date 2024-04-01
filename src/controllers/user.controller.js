import httpStatus from "http-status";
import {
  getUserRights,
  setAvailability,
  updateUser,
} from "../services/user.service.js";

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
 * Get user's availability
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
const getAvailability = async (req, res) => {
  res.status(httpStatus.OK).send({ availability: req.user.availability });
};

/**
 * Set user's weekly schedule.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} Sends an OK status in the response.
 */
const updateAvailability = async (req, res) => {
  const { weeklyTimeSlots, timeGap, hourlyRate } = req.body;
  await setAvailability({
    weeklySchedule: weeklyTimeSlots,
    timegap: timeGap.active ? timeGap.gap : null,
    hourlyRate,
    mentorId: req.user.id,
  });
  res.status(httpStatus.OK).send({ success: true });
};

/**
 * Get user rights based on user's role and permissions
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const getRights = async (req, res) => {
  /** @type {User} */
  const user = req.user;
  const rights = getUserRights(user);
  res.status(httpStatus.OK).send({ rights, role: user.accessControl.role });
};

export default {
  getAchievements,
  getVisibility,
  updateVisibility,
  getAvailability,
  updateAvailability,
  getRights,
};

/**
 * @typedef {import("../models/user.model.js").User} User
 */
