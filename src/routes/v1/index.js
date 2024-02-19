import express from "express";
import config from "../../config/config.js";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import chatRoute from "./chat.route.js";
import notesRoute from "./notes.route.js";
import chatbotRoute from "./chatbot.route.js";
import notificationRoute from "./notification.route.js";
import onboardingRoute from "./onboarding.route.js";
import profileRoute from "./profile.route.js"
const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/chats",
    route: chatRoute,
  },
  {
    path: "/notes",
    route: notesRoute,
  },
  {
    path: "/chatbot",
    route: chatbotRoute,
  },
  {
    path: "/notifications",
    route: notificationRoute,
  },
  {
    path: "/onboarding",
    route: onboardingRoute,
  },
  {
    path: "/profile",
    route: profileRoute,
  },
  // {
  //   path: "/usermatch",
  //   route: userMatchRoute,
  // }
];

// TODO: Add a docs route only for dev mode
const devRoutes = [];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// TODO: ignore these lines for test coverage
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
