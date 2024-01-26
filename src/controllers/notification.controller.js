import httpStatus from "http-status";
import notificationService from "../services/notification.service.js";
import express from "express";

/**
 * Retrieves notifications for the given user and sends the pagination result as a JSON response.
 *
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @return {Promise<void>} A promise that resolves when the response is sent
 */
const getNotifications = async (req, res) => {
  const userId = req.user._id;
  const query = { $or: [{ user: userId }, { user: { $exists: false } }] };
  const paginationResult = await notificationService.queryNotifications(query, {
    page: req.query.page || 1,
    limit: 10,
  });
  res.status(httpStatus.OK).json(paginationResult);
};

export default {
  getNotifications,
};
