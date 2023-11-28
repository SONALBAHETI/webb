import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import { createUser } from "../services/user.service.js";
import { generateAuthTokens } from "../services/token.service.js";
import { loginUserWithEmailAndPassword } from "../services/auth.service.js";

// register a user
const register = catchAsync(async (req, res) => {
  const user = await createUser(req.body);
  // generate auth token and send it to client
  const tokens = await generateAuthTokens(user);
  res
    .status(httpStatus.CREATED)
    .cookie("refreshToken", tokens.refresh.token, {
      httpOnly: true,
      sameSite: "strict",
    })
    .header("Authorization", tokens.access.token)
    .send({ user, accessToken: tokens.access.token });
});

// login a user with email and password
const loginWithEmailAndPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUserWithEmailAndPassword(email, password);
  const tokens = await generateAuthTokens(user);
  res
    .status(httpStatus.OK)
    .cookie("refreshToken", tokens.refresh.token, {
      httpOnly: true,
      sameSite: "strict",
    })
    .header("Authorization", tokens.access.token)
    .send({ user, accessToken: tokens.access.token });
});

export default { register, loginWithEmailAndPassword };
