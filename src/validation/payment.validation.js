import Joi from "joi";

const createSubscriptionCheckout = {
  body: Joi.object().keys({
    priceId: Joi.string().required(),
    successUrl: Joi.string().required(),
    cancelUrl: Joi.string().required(),
  }),
};

const createCreditsCheckout = {
  body: Joi.object().keys({
    quantity: Joi.number().required(),
    successUrl: Joi.string().required(),
    cancelUrl: Joi.string().required(),
  }),
};

const createCustomerPortal = {
  body: Joi.object().keys({
    returnUrl: Joi.string().required(),
  }),
};

const createStripeConnectedAccount = {
  body: Joi.object().keys({
    refreshUrl: Joi.string().required(),
    returnUrl: Joi.string().required(),
  }),
};

const createConnectedAccountOnboardingLink = {
  body: Joi.object().keys({
    refreshUrl: Joi.string().required(),
    returnUrl: Joi.string().required(),
  }),
};

export default {
  createSubscriptionCheckout,
  createCreditsCheckout,
  createCustomerPortal,
  createStripeConnectedAccount,
  createConnectedAccountOnboardingLink,
};
