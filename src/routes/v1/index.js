// routes/v1/index.js
import express from "express";
import config from "../../config/config.js";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import notesRoute from "./notes.route.js"; 

const router = express.Router();

// Add a route for the root path
router.get("/", (req, res) => {
  res.send("Hello from API!");
});

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
    path: "/notes", 
    route: notesRoute,
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
