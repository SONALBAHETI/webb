import Appointment from "../models/appointment.model.js";

/**
 * @typedef {import("../models/appointment.model").Appointment} Appointment
 */

/**
 * Retrieves an appointment by its ID.
 *
 * @param {string} id - The ID of the appointment.
 * @returns Mongo query for the appointment.
 */
const getAppointmentById = (id) => {
  return Appointment.findById(id);
};

/**
 * Finds an appointment by ID and user ID.
 *
 * @param {string} id - The ID of the appointment
 * @param {string} userId - The ID of the user
 * @returns Mongo query for the appointment.
 */
const getAppointmentByIdAndUserId = (id, userId) => {
  return Appointment.findOne({
    $or: [{ scheduledBy: userId }, { scheduledWith: userId }],
    _id: id,
  });
};
/**
 * Find an appointment based on the provided filter.
 *
 * @param {Object} filter - The filter to apply when searching for the appointment.
 * @returns Mongo query for the appointment.
 */
const findAppointment = (filter) => {
  return Appointment.findOne(filter);
};

export default {
  getAppointmentById,
  findAppointment,
  getAppointmentByIdAndUserId,
};
