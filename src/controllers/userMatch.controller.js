import httpStatus from "http-status";
import userMatchService from "../services/userMatch.service.js";
import ApiError from "../utils/ApiError.js";

/**
 * Get user match by ID
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return response
 */
const getUserMatch = async (req, res) => {
  const { id } = req.params;
  const userMatch = await userMatchService.getUserMatchById(id);
  if (!userMatch) {
    throw new ApiError(httpStatus.NOT_FOUND, "User match not found");
  }
  return res.status(httpStatus.OK).send({ userMatch });
};

export { getUserMatch };
