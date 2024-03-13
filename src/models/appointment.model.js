import mongoose from "mongoose";
import { toJSON } from "./plugins/index.js";

/**
 * @typedef {"pending" | "scheduled" | "reschedule requested" | "completed" | "cancelled"} AppointmentStatus
 */
const AppointmentStatus = {
  PENDING: "pending",
  SCHEDULED: "scheduled",
  RESCHEDULED_REQUESTED: "reschedule requested",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/**
 * @typedef {Object} RescheduleRequestSchema
 * @property {import("mongoose").Schema.Types.ObjectId} requestedBy - The ID of the user who requested the reschedule.
 * @property {Date} rescheduleDate - The date the reschedule was requested.
 * @property {string} rescheduleReason - The reason for the reschedule.
 * @property {Date} createdAt - The date the reschedule request was created.
 * @property {Date} updatedAt - The date the reschedule request was last updated.
 */
const rescheduleRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    rescheduleDate: {
      type: Date,
      required: true,
    },
    rescheduleReason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

rescheduleRequestSchema.plugin(toJSON);

/**
 * @typedef {Object} AppointmentSchema
 * @property {import("mongoose").Schema.Types.ObjectId} scheduledBy - The ID of the user who scheduled the appointment.
 * @property {import("mongoose").Schema.Types.ObjectId} scheduledWith - The ID of the user who was scheduled for the appointment.
 * @property {AppointmentStatus} status - The status of the appointment.
 * @property {import("mongoose").Schema.Types.ObjectId} cancelledBy - The ID of the user who cancelled the appointment.
 * @property {string} cancelReason - The reason for the cancellation.
 * @property {RescheduleRequestSchema[]} rescheduleRequests - The reschedule requests for the appointment.
 * @property {Date} scheduledDate - The date the appointment was scheduled.
 * @property {string} userGoals - The goals of the user.
 * @property {number} timeDuration - The duration of the appointment.
 * @property {Date} createdAt - The date the appointment was created.
 * @property {Date} updatedAt - The date the appointment was last updated.
 */
const appointmentSchema = new mongoose.Schema({
  scheduledBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  scheduledWith: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(AppointmentStatus),
    default: AppointmentStatus.PENDING,
  },
  cancelledBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  cancelReason: {
    type: String,
  },
  rescheduleRequests: {
    type: [rescheduleRequestSchema],
    default: [],
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  userGoals: {
    type: String,
    required: true,
  },
  timeDuration: {
    type: Number,
    required: true,
  },
  meetingRoomId: {
    type: String,
    required: true,
  },
});

appointmentSchema.plugin(toJSON);

/**
 * @typedef {AppointmentSchema & mongoose.Document} Appointment
 */
const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
