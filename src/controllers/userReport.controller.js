import httpStatus from "http-status";
import userReportService from "../services/userReport.service.js";

/**
 * Creates a new user report
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reportUser = async (req, res) => {
  const { category, reason } = req.body;
  const { id: reportedUser } = req.params;
  const { id: reportedBy } = req.user;

  const userReport = await userReportService.createUserReport({
    reportedUser,
    reportedBy,
    category,
    reason,
  });

  res.status(httpStatus.CREATED).send({ referenceId: userReport.referenceId });
};

export default {
  reportUser,
};
