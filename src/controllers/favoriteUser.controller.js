import httpStatus from "http-status";
import favoriteUserService from "../services/favoriteUser.service.js";
import { getUserById } from "../services/user.service.js";
import ApiError from "../utils/ApiError.js";

/**
 * Gets all the favorite users for a given user.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const getFavoriteUsers = async (req, res) => {
  const favoriteUsers = await favoriteUserService
    .getFavoriteUsers(req.user.id)
    .populate({
      path: "user",
      select: {
        name: 1,
        "profile.picture": 1,
        occupation: 1,
      },
    });
  return res.status(httpStatus.OK).send({ favoriteUsers });
};

/**
 * Creates a new favorite user.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const createFavoriteUser = async (req, res) => {
  const { userId, chatChannelUrl } = req.body;
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const favoriteUser = await favoriteUserService.createFavoriteUser({
    favoritedBy: req.user.id,
    user: user.id,
    chatChannelUrl,
  });
  return res.status(httpStatus.CREATED).send({ favoriteUser });
};

/**
 * Removes a favorite user.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const deleteFavoriteUser = async (req, res) => {
  const { userId } = req.params;
  const deletedFavoriteUser = await favoriteUserService.deleteFavoriteUser(
    req.user.id,
    userId
  );
  if (!deletedFavoriteUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favorite user not found");
  }
  return res.status(httpStatus.OK).send({ deleted: true });
};

/**
 * Retrieves a single favorite user.
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
const getSingleFavoriteUser = async (req, res) => {
  const { userId } = req.params;
  const favoriteUser = await favoriteUserService.getSingleFavoriteUser(
    req.user.id,
    userId
  );
  return res.status(httpStatus.OK).send({ favoriteUser });
};

export default {
  getFavoriteUsers,
  createFavoriteUser,
  deleteFavoriteUser,
  getSingleFavoriteUser,
};
