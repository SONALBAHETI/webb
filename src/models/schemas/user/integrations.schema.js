import mongoose from "mongoose";

/**
 * @typedef {Object} OpenAIIntegration
 * @property {string} [threadId] - The OpenAI thread ID
 */
/**
 * @typedef {Object} GoogleIntegration
 * @property {string} [userId] - The Google user ID
 * @property {string} [accessToken] - The OAuth access token
 * @property {string} [refreshToken] - The OAuth refresh token
 * @property {number} [expiryDate] - The OAuth expiry date
 */
/**
 * @typedef {Object} SendbirdIntegration
 * @property {string} [userId] - The Sendbird user ID
 * @property {string} [accessToken] - The Sendbird access token
 */
/**
 * @typedef {Object} SheerIDIntegration
 * @property {string} [verificationId] - The SheerID verification ID
 * @property {string} [currentStep] - The current step of the verification
 */

/**
 * @typedef {Object} IntegrationsSchema
 * @property {OpenAIIntegration} [openai] - The OpenAI integration
 * @property {GoogleIntegration} [google] - The Google integration
 * @property {SendbirdIntegration} [sendbird] - The Sendbird integration
 * @property {SheerIDIntegration} [sheerId] - The SheerID integration
 */
const integrationsSchema = new mongoose.Schema({
  openai: {
    threadId: String,
  },
  google: {
    userId: String,
    accessToken: String,
    refreshToken: String,
    expiryDate: Number, // milliseconds
  },
  sendbird: {
    userId: String,
    accessToken: String,
  },
  sheerId: {
    verificationId: String,
    currentStep: String,
  },
});

export default integrationsSchema;