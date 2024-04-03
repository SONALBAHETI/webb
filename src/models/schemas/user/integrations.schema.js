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
 * @typedef {Object} StripeIntegration
 * @property {string} [subscriptionId] - The Stripe subscription ID
 * @property {string} [subscriptionStatus] - The Stripe subscription status
 * @property {string} [customerId] - The Stripe customer ID
 * @property {string} [connectedAccountId] - The Stripe connected account ID
 * @property {boolean} [connectedAccountVerified] - Whether the connected account is verified
 */

/**
 * @typedef {Object} IntegrationsSchema
 * @property {OpenAIIntegration} [openai] - The OpenAI integration
 * @property {GoogleIntegration} [google] - The Google integration
 * @property {SendbirdIntegration} [sendbird] - The Sendbird integration
 * @property {SheerIDIntegration} [sheerId] - The SheerID integration
 * @property {StripeIntegration} [stripe] - The Stripe integration
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
  // store necessary details from stripe checkout.session.completed event
  stripe: {
    subscriptionId: String,
    subscriptionStatus: String, // possible values are incomplete, incomplete_expired, trialing, active, past_due, canceled, unpaid, or paused
    customerId: String,
    connectedAccountId: String,
    connectedAccountVerified: Boolean,
  }
});

export default integrationsSchema;