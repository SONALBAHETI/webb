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

export default {
  createSubscriptionCheckout,
  createCreditsCheckout,
};
