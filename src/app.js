import express from "express";
import cors from "cors";
import routes from "./routes/v1/index.js";
import ApiError from "./utils/ApiError.js";
import httpStatus from "http-status";
import { jwtStrategy } from "./config/passport.js";
import passport from "passport";
import { errorConverter, errorHandler } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import socketServer from "./config/socketServer.js";
import config from "./config/config.js";

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// TODO: Sanitize xss
app.use(mongoSanitize());

// parse cookies
app.use(cookieParser());

// enable cors
// TODO: In production, change this to frontend origin
app.use(
  cors({
    origin: config.frontendBaseUrl,
    credentials: true,
  })
);

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

socketServer(app).listen(3001, () => {
  console.log("Socket server running on port 3001");
});

// v1 api routes
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Resource Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
