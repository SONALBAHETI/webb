import express from "express";
import sendbirdWebhook from "./sendbird.webhook.js";

const router = express.Router();

const routes = [
  {
    path: "/sendbird",
    route: sendbirdWebhook,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
