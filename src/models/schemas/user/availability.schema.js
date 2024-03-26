import mongoose from "mongoose";

/**
 * @typedef {Object} SlotSchema
 * @property {string} from - The start time of the slot
 * @property {string} to - The end time of the slot
 */
const slotSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true,
  },
  to: {
    type: String,
    required: true,
    trim: true,
  },
});

/**
 * @typedef {Object} DayScheduleSchema
 * @property {boolean} enabled - Whether the schedule is enabled
 * @property {Array<SlotSchema>} slots - The list of slots
 */
const dayScheduleSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  slots: {
    type: [slotSchema],
    default: [{ from: "09:00 AM", to: "05:00 PM" }],
  },
});

/**
 * @typedef {Object} WeeklyScheduleSchema
 * @property {DayScheduleSchema} sunday - The schedule for Sunday
 * @property {DayScheduleSchema} monday - The schedule for Monday
 * @property {DayScheduleSchema} tuesday - The schedule for Tuesday
 * @property {DayScheduleSchema} wednesday - The schedule for Wednesday
 * @property {DayScheduleSchema} thursday - The schedule for Thursday
 * @property {DayScheduleSchema} friday - The schedule for Friday
 * @property {DayScheduleSchema} saturday - The schedule for Saturday
 */
const weeklyScheduleSchema = new mongoose.Schema({
  sunday: {
    type: dayScheduleSchema,
    default: {},
  },
  monday: {
    type: dayScheduleSchema,
    default: {},
  },
  tuesday: {
    type: dayScheduleSchema,
    default: {},
  },
  wednesday: {
    type: dayScheduleSchema,
    default: {},
  },
  thursday: {
    type: dayScheduleSchema,
    default: {},
  },
  friday: {
    type: dayScheduleSchema,
    default: {},
  },
  saturday: {
    type: dayScheduleSchema,
    default: {},
  },
});

/**
 * @typedef {Object} AvailabilitySchema
 * @property {boolean} online - Whether the user is online
 * @property {WeeklyScheduleSchema} weeklySchedule - The weekly schedule
 */
const availabilitySchema = new mongoose.Schema({
  online: {
    type: Boolean,
    default: false,
  },
  weeklySchedule: {
    type: weeklyScheduleSchema,
    default: {},
  },
});

export default availabilitySchema;