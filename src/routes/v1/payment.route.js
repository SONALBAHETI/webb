import express from "express";
import auth from "../../middlewares/auth.js";
import responseHandler from "../../utils/responseHandler.js";
import validate from "../../middlewares/validate.js";
import paymentController from "../../controllers/payment.controller.js";
import paymentValidation from "../../validation/payment.validation.js";

const router = express.Router();

router.post(
  "/checkout/subscription",
  auth(),
  validate(paymentValidation.createSubscriptionCheckout),
  responseHandler(paymentController.createSubscriptionCheckout)
);

router.post(
  "/checkout/credits",
  auth(),
  validate(paymentValidation.createCreditsCheckout),
  responseHandler(paymentController.createCreditsCheckout)
);

router.post(
  "/customer-portal",
  auth(),
  validate(paymentValidation.createCustomerPortal),
  responseHandler(paymentController.createCustomerPortal)
);

router.get(
  "/stripe/enabled",
  auth(),
  responseHandler(paymentController.isStripeCustomerAccountEnabled)
);

router.get(
  "/credits",
  auth(),
  responseHandler(paymentController.getCreditBalance)
);

router.get(
  "/subscription",
  auth(),
  responseHandler(paymentController.getSubscription)
);

router.post(
  "/stripe/connect",
  auth(),
  validate(paymentValidation.createStripeConnectedAccount),
  responseHandler(paymentController.createStripeConnectedAccount)
);

router.post(
  "/stripe/connect/onboarding",
  auth(),
  validate(paymentValidation.createConnectedAccountOnboardingLink),
  responseHandler(paymentController.createConnectedAccountOnboardingLink)
);

router.post(
  "/stripe/connect/login",
  auth(),
  responseHandler(paymentController.createConnectedAccountLoginLink)
);

router.get(
  "/stripe/connect/status",
  auth(),
  responseHandler(paymentController.getConnectedAccountStatus)
);

export default router;
