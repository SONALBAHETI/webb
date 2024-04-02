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

export default router;
