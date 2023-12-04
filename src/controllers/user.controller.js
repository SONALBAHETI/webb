import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import { userService } from "../services/user.service.js";

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export { createUser };
