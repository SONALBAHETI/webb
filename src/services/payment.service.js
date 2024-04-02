import StripeAPI from "../providers/stripe/api.js";
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

export default {
  createCheckout,
  getSubscription,
};

/**
 * @typedef {import("../models/user.model").User} User
 */
