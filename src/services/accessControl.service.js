import User from "../models/user.model.js";
import { Permission } from "../config/permissions.js";

/**
 * Assign permissions to user
 * @param {string} userId - The ID of the user
 * @param {Array<Permission>} permissions - The permissions to be assigned
 */
const assignPermissions = async (userId, permissions) => {
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $addToSet: {
        "accessControl.permissions": {
          $each: permissions,
        },
      },
    },
  );
};

/**
 * Remove permissions from user
 * @param {string} userId - The ID of the user
 * @param {Array<Permission>} permissions - The permissions to be removed
 */
const removePermissions = async (userId, permissions) => {
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $pull: {
        "accessControl.permissions": {
          $in: permissions,
        },
      },
    },
  );
};

/**
 * Assign role to user
 * @param {User} user - The ID of the user
 * @param {string} role - The role to be assigned
 */
const assignRole = async (user, role) => {
  user.accessControl.role = role;
  await user.save();
}

export default {
  assignPermissions,
  removePermissions,
  assignRole,
};

/**
 * @typedef {import("../models/user.model.js").User} User
 */
