import passport from "passport";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import { roleRights } from "../config/roles.js";

/**
 * A function that verifies the callback by checking for any errors,
 * information, and the existence of a user. If there are any errors or
 * missing information, it rejects with an error message. Otherwise, it checks if the user has the required
 * rights. If the user does not have the required rights and the user ID in
 * the request parameters is not the same as the user ID, it rejects with a
 * "Forbidden" error message. Otherwise, it resolves.
 *
 * @param {Object} req - The request object.
 * @param {Function} resolve - The resolve function.
 * @param {Function} reject - The reject function.
 * @param {Array} requiredRights - An array of required rights.
 * @return {void}
 */
const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  };

/**
 * Generates an authentication middleware function
 * that checks if the user is authorized to access the route and has the required rights.
 *
 * @param {...string} requiredRights - The required rights that the user must have.
 * @returns {function} - The authentication middleware function.
 */
const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
