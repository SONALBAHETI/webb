import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.plugin.js";

/**
 * @typedef {Object} FavoriteUserSchema
 * @property {import("mongoose").Schema.Types.ObjectId} favoritedBy - The ID of the user who favorited the user.
 * @property {import("mongoose").Schema.Types.ObjectId} user - The favorited user.
 * @property {string} [chatChannelUrl] - The URL of the chat channel
 */
const favoriteUserSchema = new mongoose.Schema({
  favoritedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chatChannelUrl: String,
});

favoriteUserSchema.plugin(toJSON);

/**
 * @typedef {import("mongoose").HydratedDocument<FavoriteUserSchema>} FavoriteUser
 * @type {import("mongoose").Model<FavoriteUserSchema, {}, {}, {}, FavoriteUser>}
 */
const FavoriteUser = mongoose.model("FavoriteUser", favoriteUserSchema);

export default FavoriteUser;

/**
 * @typedef {import("../models/user.model.js").User} User
 */
