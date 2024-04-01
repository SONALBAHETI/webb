import mongoose from "mongoose";
import { ROLE, roles } from "../../../config/roles.js";
import { PermissionValues } from "../../../config/permissions.js";

/**
 * @typedef {Object} AccessControlSchema
 * @property {string} role - The user's role
 * @property {string[]} permissions - The user's permissions
 */
const accessControlSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: roles,
      default: ROLE.USER,
    },
    permissions: {
      type: [String],
      enum: PermissionValues,
      default: [],
    },
  },
  { _id: false }
);

export default accessControlSchema;
