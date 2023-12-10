// validation schemas for auth routes
import Joi from "joi";
import { password } from "./custom.validation.js";

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const loginWithEmailAndPassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object()
    .keys({
      refreshToken: Joi.string(),
    })
    .when("cookies", {
      is: Joi.object().keys({
        refreshToken: Joi.exist(),
      }),
      // if cookie.refreshToken doesn't exist, make this required
      otherwise: Joi.object({ refreshToken: Joi.required() }).required(),
    }),
  cookies: Joi.object()
    .keys({
      refreshToken: Joi.string(),
    })
    .when("body", {
      is: Joi.object().keys({
        refreshToken: Joi.exist(),
      }),
      // if body.refreshToken doesn't exist, make this required
      otherwise: Joi.object({ refreshToken: Joi.required() }).required(),
    }),
};

export default { register, loginWithEmailAndPassword, refreshTokens };
