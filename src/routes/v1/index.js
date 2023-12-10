import express from "express";
import config from "../../config/config.js";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";

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
