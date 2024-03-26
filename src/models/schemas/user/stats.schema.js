import mongoose from "mongoose";

/**
 * @typedef {Object} StatsSchema
 * @property {number} hoursLearned - The number of hours learned
 * @property {number} hoursMentored - The number of hours mentored
 * @property {number} chatMessagesSent - The number of chat messages sent
 * @property {number} chatMessagesRead - The number of chat messages received
 * @property {number} videoSessions - The number of video sessions
 * @property {number} averageRatings - The average rating
 * @property {number} averageResponseTime - The average response time
 * @property {number} averageResponseRate - The average response rate
 */
const statsSchema = new mongoose.Schema({
  hoursLearned: {
    type: Number,
    default: 0,
  },
  hoursMentored: {
    type: Number,
    default: 0,
  },
  chatMessagesSent: {
    type: Number,
    default: 0,
  },
  chatMessagesRead: {
    type: Number,
    default: 0,
  },
  videoSessions: {
    type: Number,
    default: 0,
  },
  averageRatings: {
    type: Number,
    default: 0,
  },
  averageResponseTime: {
    type: Number,
    default: 0,
  },
  averageResponseRate: {
    type: Number,
    default: 0,
  },
});

export default statsSchema;