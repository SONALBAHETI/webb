import Stripe from "stripe";
import httpStatus from "http-status";
import { ROLE } from "../config/roles.js";
import StripeAPI from "../providers/stripe/api.js";
import ApiError from "../utils/ApiError.js";
import { updateUser } from "./user.service.js";

const stripe = new StripeAPI();

/**
 * Creates a new customer in stripe
 * @param {User} user
 * @returns The created customer
 */
const createCustomer = async (user) => {
  const customer = await stripe.createCustomer({
    email: user.email,
    name: user.name,
  });
  await updateUser(user, {
    integrations: { stripe: { customerId: customer.id } },
  });
  return customer;
};

/**
 * Retrieves or creates a customer in stripe
 * @param {string} customerId
 * @param {User} user
 * @returns the retrieved or created customer
 */
const getOrCreateCustomer = async (customerId, user) => {
  if (!customerId) {
    const customer = await createCustomer(user);
    return customer;
  } else {
    const customer = await stripe.retrieveCustomer(customerId);
    // if customer is deleted, create a new one
    if (customer.deleted) {
      const newCustomer = await createCustomer(user);
      return newCustomer;
    }
    return customer;
  }
};

/**
 * Creates a checkout session
 * @param {Object} options - The options object
 * @param {User} options.user - The user initiating the checkout session
 * @param {import("stripe").Stripe.Checkout.SessionCreateParams.Mode} options.mode - Checkout mode
 * @param {string} options.priceId - Price Id of the product
 * @param {number} options.quantity - Quantity of the product
 * @param {string} options.successUrl - The success url
 * @param {string} options.cancelUrl - The cancel url
 */
const createCheckout = async ({
  user,
  mode = "payment",
  priceId,
  quantity = 1,
  successUrl,
  cancelUrl,
}) => {
  let { customerId } = user.getStripeData();
  // we will validate that the stored customer id is valid or not before creating checkout session
  // if invalid, this will create a new customer
  const customer = await getOrCreateCustomer(customerId, user);

  const session = await stripe.createCheckoutSession({
    mode,
    line_items: [
      {
        price: priceId,
        quantity: quantity,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer: customer.id,
  });
  return session;
};

/**
 * Create customer portal session in stripe
 * @param {User} user
 * @param {string} returnUrl - The return url from the portal back to the app
 */
const createCustomerPortal = async (user, returnUrl) => {
  const { customerId } = user.getStripeData();
  const session = await stripe.createCustomerPortalSession(
    customerId,
    returnUrl
  );
  return session;
};

/**
 * Get subscription plan of a user from stripe
 * @param {User} user - The user to get active subscription for
 * @param {import("stripe").Stripe.SubscriptionRetrieveParams} [params]
 * @returns The subscription plan
 */
const getSubscription = async (user, params) => {
  const { subscriptionId } = user.getStripeData();
  if (subscriptionId) {
    const subscription = await stripe.retrieveSubscription(
      subscriptionId,
      params
    );
    return subscription;
  }
  return null;
};

/**
 * Create connected account in stripe
 * @param {User} user
 */
const createConnectedAccount = async (user) => {
  const role = user.accessControl.role;
  if (role !== ROLE.MENTOR) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only verified mentors can create a payout account"
    );
  }
  if (!user.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User email is required");
  }
  if (user.getStripeData().connectedAccountId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Connected account is already created"
    );
  }
  const account = await stripe.createConnectedAccount({
    email: user.email,
    individual: {
      first_name: user.getFirstName(),
      last_name: user.getLastName(),
    },
    metadata: {
      id: user.id,
    },
  });
  return account;
};

/**
 * Create connected account link
 * @param {Object} options
 * @param {string} options.accountId - The account id
 * @param {string} options.refreshUrl - The refresh url
 * @param {string} options.returnUrl - The return url
 * @param {Stripe.AccountLinkCreateParams.Type} options.type - The type
 */
const createConnectedAccountLink = async ({
  accountId,
  refreshUrl,
  returnUrl,
  type,
}) => {
  const link = await stripe.createConnectedAccountLink({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type,
  });
  return link;
};

/**
 * Create connected account link
 * @param {string} accountId - The account id
 */
const createConnectedAccountLoginLink = async (accountId) => {
  const link = await stripe.createConnectedAccountLoginLink(accountId);
  return link;
};

export default {
  createCheckout,
  getSubscription,
  createCustomerPortal,
  createConnectedAccount,
  createConnectedAccountLink,
  createConnectedAccountLoginLink,
};

/**
 * @typedef {import("../models/user.model").User} User
 */
