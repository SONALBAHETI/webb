import { Router, raw } from "express";
import httpStatus from "http-status";
import logger from "../config/logger.js";
import StripeAPI from "../providers/stripe/api.js";
import {
  getUserByStripeConnectedAccountId,
  getUserByStripeCustomerId,
  updateUser,
} from "../services/user.service.js";
import webhookHandler from "../utils/webhookHandler.js";

const router = Router();
const stripe = new StripeAPI();

/**
 * Handles stripe subscription checkout session completed event
 * @param {import("stripe").Stripe.Checkout.Session} session
 */
const handleSubscriptionCheckoutSessionCompleted = async (session) => {
  const subscriptionId = session.subscription;
  const subscription = await stripe.retrieveSubscription(subscriptionId);
  const user = await getUserByStripeCustomerId(session.customer);
  if (user) {
    await updateUser(user.id, {
      integrations: {
        stripe: {
          subscriptionId,
          subscriptionStatus: subscription.status,
        },
      },
    });
  } else {
    logger.warn(
      "⚠️ ~ Stripe webhook ~ handleSubscriptionCheckoutSessionCompleted ~ user not found for customer",
      { customer: session.customer }
    );
  }
};

/**
 * Handles stripe payment checkout session completed event
 * @param {import("stripe").Stripe.Checkout.Session} session
 */
const handlePaymentCheckoutSessionCompleted = async (session) => {
  const creditsPurchased = (session.amount_total / 100) * 5; // 5 credits per 100 cents ($1.00)
  const user = await getUserByStripeCustomerId(session.customer);
  if (user) {
    await updateUser(user.id, {
      creditBalance: user.creditBalance + creditsPurchased,
    });
  } else {
    logger.warn(
      "⚠️ ~ Stripe webhook ~ handlePaymentCheckoutSessionCompleted ~ user not found for customer",
      { customer: session.customer }
    );
  }
};

/**
 * Handles stripe checkout session completed event
 * @param {StripeEvent} event - Stripe event
 */
const handleCheckoutSessionCompleted = async (event) => {
  const session = event.data.object;
  if (session.object === "checkout.session") {
    if (session.mode === "subscription" && session.status === "complete") {
      await handleSubscriptionCheckoutSessionCompleted(session);
    } else if (session.mode === "payment" && session.status === "complete") {
      await handlePaymentCheckoutSessionCompleted(session);
    }
  }
};

/**
 * Handles stripe customer subscription deleted event
 * @param {import("stripe").Stripe.CustomerSubscriptionDeletedEvent} event
 */
const handleCustomerSubscriptionDeleted = async (event) => {
  const subscription = event.data.object;
  const user = await getUserByStripeCustomerId(subscription.customer);
  if (user && user.getStripeData().subscriptionId === subscription.id) {
    await updateUser(user.id, {
      integrations: {
        stripe: {
          subscriptionId: null,
          subscriptionStatus: null,
        },
      },
    });
  } else {
    logger.warn(
      "⚠️ ~ Stripe webhook ~ handleCustomerSubscriptionDeleted ~ user not found for customer",
      { customer: subscription.customer }
    );
  }
};

/**
 * Handles stripe connected account updated event
 * @param {import("stripe").Stripe.AccountUpdatedEvent} event
 */
const handleConnectedAccountUpdated = async (event) => {
  const account = event.data.object;
  const user = await getUserByStripeConnectedAccountId(account.id);
  if (user) {
    if (
      !user.getStripeData().connectedAccountVerified &&
      account.payouts_enabled
    ) {
      await updateUser(user.id, {
        integrations: {
          stripe: {
            connectedAccountVerified: true,
          },
        },
      });
    }
  } else {
    logger.warn(
      "⚠️ ~ Stripe webhook ~ handleConnectedAccountUpdated ~ user not found for connected account",
      { connectedAccount: account.id }
    );
  }
};

/**
 * Process the webhook event and send response
 * @param {import("express").Request} req - The request
 * @param {import("express").Response} res - The response
 */
const processWebhook = async (req, res) => {
  /** @type {StripeEvent} */
  const event = req.event;

  if (event.type === "checkout.session.completed") {
    await handleCheckoutSessionCompleted(event);
  } else if (event.type === "customer.subscription.deleted") {
    await handleCustomerSubscriptionDeleted(event);
  } else if (event.type === "account.updated") {
    await handleConnectedAccountUpdated(event);
  }

  return res.status(httpStatus.OK).end();
};

const verifySignature = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  try {
    const event = await stripe.constructEvent(req.body, signature);
    req.event = event;
    next();
  } catch (error) {
    logger.error("❌ ~ Stripe webhook ~ verifySignature ~ failed", error);
    return res.status(httpStatus.BAD_REQUEST).send({ error });
  }
};

router.post(
  "/",
  raw({ type: "application/json" }),
  verifySignature,
  webhookHandler(processWebhook)
);

export default router;

/**
 * @typedef {import("stripe").Stripe.Event} StripeEvent
 */
