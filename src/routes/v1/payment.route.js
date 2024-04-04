import express from "express";
import auth from "../../middlewares/auth.js";
import responseHandler from "../../utils/responseHandler.js";
import validate from "../../middlewares/validate.js";
import paymentController from "../../controllers/payment.controller.js";
import paymentValidation from "../../validation/payment.validation.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router.post(
  "/checkout/subscription",
  auth(Permission.ManageSubscriptions),
  validate(paymentValidation.createSubscriptionCheckout),
  responseHandler(paymentController.createSubscriptionCheckout)
);

router.post(
  "/checkout/credits",
  auth(Permission.ManageCredits),
  validate(paymentValidation.createCreditsCheckout),
  responseHandler(paymentController.createCreditsCheckout)
);

router.post(
  "/customer-portal",
  auth(Permission.ManageSubscriptions),
  validate(paymentValidation.createCustomerPortal),
  responseHandler(paymentController.createCustomerPortal)
);

router.get(
  "/stripe/enabled",
  auth(Permission.ManageSubscriptions),
  responseHandler(paymentController.isStripeCustomerAccountEnabled)
);

router.get(
  "/credits",
  auth(Permission.ManageCredits),
  responseHandler(paymentController.getCreditBalance)
);

router.get(
  "/subscription",
  auth(Permission.ManageSubscriptions),
  responseHandler(paymentController.getSubscription)
);

router.post(
  "/stripe/connect",
  auth(Permission.ManagePayouts),
  validate(paymentValidation.createStripeConnectedAccount),
  responseHandler(paymentController.createStripeConnectedAccount)
);

router.post(
  "/stripe/connect/onboarding",
  auth(Permission.ManagePayouts),
  validate(paymentValidation.createConnectedAccountOnboardingLink),
  responseHandler(paymentController.createConnectedAccountOnboardingLink)
);

router.post(
  "/stripe/connect/login",
  auth(Permission.ManagePayouts),
  responseHandler(paymentController.createConnectedAccountLoginLink)
);

router.get(
  "/stripe/connect/status",
  auth(Permission.ManagePayouts),
  responseHandler(paymentController.getConnectedAccountStatus)
);

export default router;
