import UserReport from "../models/userReport.model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Query for user reports
 * @param {Object} query - Mongo query
 * @param {import("../models/plugins/paginate.plugin.js").PaginationOptions} options - pagination options
 * @returns {Promise<import("../models/plugins/paginate.plugin.js").PaginationResult>}
 */
const queryUserReports = async (query, options) => {
  const result = await UserReport.paginate(query, options);
  return result;
};

/**
 * Creates a new user report
 * @param {Omit<UserReportSchema, "referenceId"> & Partial<Pick<UserReportSchema, "referenceId">>} options
 */
const createUserReport = async (options) => {
  options.referenceId = options.referenceId || uuidv4();
  const userReport = await UserReport.create(options);
  return userReport;
};

export default {
  createUserReport,
  queryUserReports,
};

/**
 * @typedef {import("../models/userReport.model.js").UserReportSchema} UserReportSchema
 */
