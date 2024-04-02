import express from "express";
import sendbirdWebhook from "./sendbird.webhook.js";
import stripeWebhook from "./stripe.webhook.js";

const router = express.Router();

const routes = [
  {
    path: "/sendbird",
    route: sendbirdWebhook,
  },
  {
    path: "/stripe",
    route: stripeWebhook,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
