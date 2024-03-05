import Badge from "../models/badge.model.js";
import User from "../models/user.model.js";

const getAllBadges = async () => {
  return await Badge.find();
};

const createNewBadge = async (badge) => {
  const newBadge = new Badge(badge);
  return await newBadge.save();
};

const findBadgeById = async (badgeId) => {
  return await Badge.findById(badgeId);
};

const findBadgeByName = async (name) => {
  return await Badge.findOne({ name });
};

const assignBadge = async (userId, badgeId) => {
  const badge = await findBadgeById(badgeId);
  if (!badge) {
    throw new Error("Badge not found");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        "achievements.badges": {
          originalBadge: badge.id,
          name: badge.name,
          icon: badge.icon,
        },
      },
    },
    { new: true }
  );
  return user;
};

const removeBadge = async (userId, badgeId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        "achievements.badges": {
          originalBadge: badgeId,
        },
      },
    },
    { new: true }
  );
  return user;
};

export default {
  getAllBadges,
  createNewBadge,
  findBadgeById,
  findBadgeByName,
  assignBadge,
  removeBadge,
};
