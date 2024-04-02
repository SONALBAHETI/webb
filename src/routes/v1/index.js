import express from "express";
import config from "../../config/config.js";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import chatRoute from "./chat.route.js";
import notesRoute from "./notes.route.js";
import chatbotRoute from "./chatbot.route.js";
import notificationRoute from "./notification.route.js";
import onboardingRoute from "./onboarding.route.js";
import profileRoute from "./profileSettings.route.js";
import accountSettingsRoute from "./accountSettings.route.js";
import userMatchRoute from "./userMatch.route.js";
import mentorVerificationRoute from "./mentorVerification.route.js";
import studentVerificationRoute from "./studentVerification.route.js";
import sheerIDVerificationRoute from "./sheerIDVerification.route.js";
import appointmentRoute from "./appointment.route.js";
import paymentRoute from "./payment.route.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
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
    path: "/settings/profile",
    route: profileRoute,
  },
  {
    path: "/settings/account",
    route: accountSettingsRoute,
  },
  {
    path: "/usermatch",
    route: userMatchRoute,
  },
  {
    path: "/verification/identity/mentor",
    route: mentorVerificationRoute,
  },
  {
    path: "/verification/identity/student",
    route: studentVerificationRoute,
  },
  {
    path: "/verification/identity",
    route: sheerIDVerificationRoute,
  },
  {
    path: "/appointments",
    route: appointmentRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  }
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
