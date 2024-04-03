// import and initialize stripe using es modules
import Stripe from "stripe";
import config from "../../config/config.js";

const stripe = new Stripe(config.stripe.secretKey);

/**
 * Stripe API class to handle
 * - Creating checkout session
 */
class StripeAPI {
  constructor() {}
  /**
   * Creates a checkout session
   *
   * @param {Stripe.Checkout.SessionCreateParams} options
   * @returns The checkout session promise
   */
  async createCheckoutSession(options) {
    const session = await stripe.checkout.sessions.create(options);
    return session;
  }

  /**
   * Retrieves a checkout session
   * @param {string} sessionId - The session id
   * @param {Stripe.Checkout.SessionRetrieveParams} [params]
   * @returns The checkout session promise
   */
  async retrieveCheckoutSession(sessionId, params) {
    const session = await stripe.checkout.sessions.retrieve(sessionId, params);
    return session;
  }

  /**
   * Retrieves a subscription
   * @param {string} subscriptionId - The subscription id
   * @param {Stripe.SubscriptionRetrieveParams} [params]
   */
  async retrieveSubscription(subscriptionId, params) {
    const subscription = await stripe.subscriptions.retrieve(
      subscriptionId,
      params
    );
    return subscription;
  }

  /**
   * Creates a new customer in stripe
   * @param {Stripe.CustomerCreateParams} options
   * @returns The customer
   */
  async createCustomer(options) {
    const customer = await stripe.customers.create(options);
    return customer;
  }

  /**
   * Retrieves a customer
   * @param {string} customerId - The customer id
   */
  async retrieveCustomer(customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  }

  /**
   * Create customer portal session
   * @param {string} customerId - The customer id of the logged in user
   * @param {string} returnUrl - The return url
   */
  async createCustomerPortalSession(customerId, returnUrl) {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  }

  /**
   * Construct an event from webhook's raw body and signature
   * @param {string} rawBody - The raw body
   * @param {string} signature - The signature
   * @returns The event
   */
  async constructEvent(rawBody, signature) {
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe.webhookSecret
    );
  }

  /**
   * Creates a connected account in stripe
   * @param {Stripe.AccountCreateParams} options - Account create options
   * @returns The created connected account
   */
  async createConnectedAccount(options) {
    const account = await stripe.accounts.create({
      type: "express",
      business_type: "individual",
      capabilities: {
        transfers: {
          requested: true,
        }
      },
      ...options,
    });
    return account;
  }

  /**
   * Creates an account link for a connected account
   * @param {Stripe.AccountLinkCreateParams} options - Account link create options
   */
  async createConnectedAccountLink(options) {
    const link = await stripe.accountLinks.create(options);
    return link;
  }

  /**
   * Creates a login link for a connected account
   * @param {string} accountId - The account id
   */
  async createConnectedAccountLoginLink(accountId) {
    const link = await stripe.accounts.createLoginLink(accountId);
    return link;
  }
}

export default StripeAPI;
