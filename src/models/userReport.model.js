import mongoose from "mongoose";
import { toJSON, paginate } from "./plugins/index.js";
import { UserReportCategoryValues, UserReportStatus, UserReportStatusValues } from "../constants/userReport.js";
/**
 * @typedef {Object} UserReportSchema
 * @property {import("mongoose").Schema.Types.ObjectId} reportedBy - The ID of the user who reported the user.
 * @property {import("mongoose").Schema.Types.ObjectId} reportedUser - The reported user.
 * @property {string} referenceId - The ID of the reference.
 * @property {string} category - The category of the report.
 * @property {string} reason - The reason of the report.
 * @property {string} status - The status of the report.
 * @property {string} [remarks] - The remarks of the report.
 */
const userReportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referenceId: {
      type: String,
      index: true,
    },
    category: {
      type: String,
      enum: UserReportCategoryValues,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: UserReportStatusValues,
      default: UserReportStatus.PENDING,
      required: true,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

// plugins
userReportSchema.plugin(toJSON);
userReportSchema.plugin(paginate);

/**
 * @typedef {import("mongoose").HydratedDocument<UserReportSchema>} UserReport
 * @type {import("mongoose").Model<UserReportSchema, {}, {}, {}, UserReport>}
 */
const UserReport = mongoose.model("UserReport", userReportSchema);

export default UserReport;
