import mongoose from "mongoose";

/**
 * @typedef {Object} AccountStatusSchema
 * @property {boolean} isEmailVerified - Whether the user's email has been verified
 * @property {boolean} isOnboarded - Whether the user has been onboarded
 * @property {boolean} isActive - Whether the user is active
 * @property {Date} [deletionScheduledAt] - The date at which the user's account will be deleted
 */
const accountStatusSchema = new mongoose.Schema({
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isOnboarded: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  deletionScheduledAt: Date,
});

export default accountStatusSchema;