import httpStatus from "http-status";
import { getUserMatchById } from "../services/userMatch.service.js";

/**
 * Get user match by ID
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @return response
 */
const getUserMatch = async (req, res) => {
  const { id } = req.params;
  const userMatch = await getUserMatchById(id);
  if (!userMatch) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "User match not found" });
  }
  return res.status(httpStatus.OK).send({ userMatch });
};

export { getUserMatch };
