import FavoriteUser from "../models/favoriteUser.model.js";

/**
 * Retrieves all the favorite users for a given user.
 * @param {string} userId
 * @returns the mongoose query that can be executed with options
 */
const getFavoriteUsers = (userId) => {
  const favoriteUsers = FavoriteUser.find({ favoritedBy: userId });
  return favoriteUsers;
};

/**
 * Creates a new favorite user.
 * @param {FavoriteUserSchema} options
 */
const createFavoriteUser = async (options) => {
  const favoriteUser = await FavoriteUser.create(options);
  return favoriteUser;
};

/**
 * Removes a favorite user.
 * @param {string} favoritedById
 * @param {string} userId
 */
const deleteFavoriteUser = async (favoritedById, userId) => {
  const deletedFavoriteUser = await FavoriteUser.findOneAndDelete({
    favoritedBy: favoritedById,
    user: userId,
  });
  return deletedFavoriteUser;
};

/**
 * Retrieves a single favorite user.
 * @param {string} favoritedById
 * @param {string} userId
 */
const getSingleFavoriteUser = async (favoritedById, userId) => {
  const favoriteUser = await FavoriteUser.findOne({
    favoritedBy: favoritedById,
    user: userId,
  });
  return favoriteUser;
};

export default {
  getFavoriteUsers,
  createFavoriteUser,
  deleteFavoriteUser,
  getSingleFavoriteUser,
};

/**
 * @typedef {import("../models/favoriteUser.model.js").FavoriteUserSchema} FavoriteUserSchema
 */
