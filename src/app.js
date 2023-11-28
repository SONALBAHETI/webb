import express from "express";
import cors from "cors";
import routes from "./routes/v1/index.js";
import ApiError from "./utils/ApiError.js";
import httpStatus from "http-status";
import { jwtStrategy } from './config/passport.js';
import passport from "passport";


const app = express();

// parse json request body
app.use(express.json());

// enable cors
// TODO: In production, allow only specific origins
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// v1 api routes
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Resource Not found"));
});

// convert error to ApiError, if needed
// app.use(errorConverter);

// handle error
// app.use(errorHandler);

export default app;
