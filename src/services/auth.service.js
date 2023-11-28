import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import { getUserByEmail } from "./user.service.js";


/**
 * Authenticates a user with their email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @return {Promise<User>} The authenticated user.
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

export { loginUserWithEmailAndPassword };
