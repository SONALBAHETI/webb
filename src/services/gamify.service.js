import Badge from "../models/badge.model.js";
import { getUserById, updateUser } from "./user.service.js";

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
  let user = await getUserById(userId).select("achievements");
  if (!user) {
    throw new Error("User not found");
  }
  user = await updateUser(userId, {
    achievements: {
      badges: [
        ...user.getBadges(),
        {
          originalBadge: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
        },
      ],
    },
  });
  return user;
};

const removeBadge = async (userId, badgeId) => {
  let user = await getUserById(userId).select("achievements");
  if (!user) {
    throw new Error("User not found");
  }
  user = await updateUser(userId, {
    achievements: {
      badges: user.getBadges().filter((b) => b.originalBadge !== badgeId),
    },
  });
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
