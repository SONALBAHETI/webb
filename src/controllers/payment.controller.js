import httpStatus from "http-status";
import paymentService from "../services/payment.service.js";
import config from "../config/config.js";
import { updateUser } from "../services/user.service.js";
import ApiError from "../utils/ApiError.js";

/**
 * Creates a checkout session for a subscription product in stripe
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const createSubscriptionCheckout = async (req, res) => {
  const { priceId, successUrl, cancelUrl } = req.body;
  const session = await paymentService.createCheckout({
    user: req.user,
    mode: "subscription",
    priceId,
    successUrl,
    cancelUrl,
  });
  res.status(httpStatus.OK).send({ sessionUrl: session.url });
};

/**
 * Creates a checkout session for purchasing credits
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const createCreditsCheckout = async (req, res) => {
  const { quantity, successUrl, cancelUrl } = req.body;
  const session = await paymentService.createCheckout({
    user: req.user,
    mode: "payment",
    priceId: config.stripe.creditPriceId,
    quantity,
    successUrl,
    cancelUrl,
  });
  res.status(httpStatus.OK).send({ sessionUrl: session.url });
};

/**
 * Get credit balance of a user
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const getCreditBalance = async (req, res) => {
  return res.status(httpStatus.OK).send({ credits: req.user.creditBalance });
};

/**
 * Get current subscription of a user
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const getSubscription = async (req, res) => {
  const subscription = await paymentService.getSubscription(req.user, {
    expand: ["plan.product"],
  });
  if (!subscription) {
    return res.status(httpStatus.OK).send({ subscription: null });
  }
  const { status, current_period_end, ended_at, cancel_at } = subscription;
  return res.status(httpStatus.OK).send({
    subscription: {
      name: subscription.plan?.product?.name,
      description: subscription.plan?.product?.description,
      status,
      currentPeriodEnd: current_period_end,
      cancelAt: cancel_at,
      endedAt: ended_at,
    },
  });
};

/**
 * Create customer portal session in stripe
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const createCustomerPortal = async (req, res) => {
  const { returnUrl } = req.body;
  const session = await paymentService.createCustomerPortal(
    req.user,
    returnUrl
  );
  res.status(httpStatus.OK).send({ sessionUrl: session.url });
};

/**
 * Check if stripe customer account is enabled
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const isStripeCustomerAccountEnabled = async (req, res) => {
  res
    .status(httpStatus.OK)
    .send({ enabled: !!req.user.getStripeData()?.customerId });
};

/**
 * Create connected account in stripe for verified mentors
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const createStripeConnectedAccount = async (req, res) => {
  /** @type {User} */
  const user = req.user;
  const { refreshUrl, returnUrl } = req.body;
  const account = await paymentService.createConnectedAccount(user);
  await updateUser(user.id, {
    integrations: {
      stripe: {
        connectedAccountId: account.id,
      },
    },
  });
  const accountLink = await paymentService.createConnectedAccountLink({
    accountId: account.id,
    refreshUrl: refreshUrl,
    returnUrl: returnUrl,
    type: "account_onboarding",
  });
  res.status(httpStatus.OK).send({ onboardingUrl: accountLink.url });
};

/**
 * create connected account onboarding link
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const createConnectedAccountOnboardingLink = async (req, res) => {
  /** @type {User} */
  const user = req.user;
  const { refreshUrl, returnUrl } = req.body;
  const accountId = user.getStripeData()?.connectedAccountId;
  if (!accountId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Stripe connected account not found"
    );
  }
  const accountLink = await paymentService.createConnectedAccountLink({
    accountId,
    refreshUrl: refreshUrl,
    returnUrl: returnUrl,
    type: "account_onboarding",
  });
  res.status(httpStatus.OK).send({ onboardingUrl: accountLink.url });
};

/**
 * create connected account login link
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const createConnectedAccountLoginLink = async (req, res) => {
  /** @type {User} */
  const user = req.user;
  const accountId = user.getStripeData()?.connectedAccountId;
  const isVerified = user.getStripeData()?.connectedAccountVerified;
  if (!accountId || !isVerified) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Stripe connected account not found or not verified."
    );
  }
  const accountLoginLink = await paymentService.createConnectedAccountLoginLink(
    accountId
  );
  res.status(httpStatus.OK).send({ loginUrl: accountLoginLink.url });
};

/**
 * Get connected account status
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const getConnectedAccountStatus = async (req, res) => {
  /** @type {User} */
  const user = req.user;
  const connectedAccountId = user.getStripeData()?.connectedAccountId;
  const isVerified = user.getStripeData()?.connectedAccountVerified;
  res
    .status(httpStatus.OK)
    .send({ created: !!connectedAccountId, verified: isVerified });
};

export default {
  createSubscriptionCheckout,
  createCreditsCheckout,
  getCreditBalance,
  getSubscription,
  createCustomerPortal,
  isStripeCustomerAccountEnabled,
  createStripeConnectedAccount,
  createConnectedAccountOnboardingLink,
  getConnectedAccountStatus,
  createConnectedAccountLoginLink,
};

/**
 * @typedef {import("../models/user.model").User} User
 */
