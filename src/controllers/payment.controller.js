import httpStatus from "http-status";
import paymentService from "../services/payment.service.js";
import config from "../config/config.js";

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
  const { status, current_period_end } = subscription;
  return res.status(httpStatus.OK).send({
    subscription: {
      name: subscription.plan?.product?.name,
      description: subscription.plan?.product?.description,
      status,
      renewsAt: current_period_end,
    },
  });
};

export default {
  createSubscriptionCheckout,
  createCreditsCheckout,
  getCreditBalance,
  getSubscription,
};
