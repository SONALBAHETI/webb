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
  const userId = req.user.id;
  const query = { $or: [{ user: userId }, { user: { $exists: false } }] };
  const paginationResult = await notificationService.queryNotifications(query, {
    page: req.query.page,
    limit: req.query.limit,
  });
  const docIds = paginationResult.docs.map((doc) => doc.id);
  // mark notifications as read on retrieval
  await notificationService.markNotificationsAsRead(docIds);
  res.status(httpStatus.OK).json(paginationResult);
};

/**
 * Retrieves the count of unread notifications for the authorized user.
 *
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @returns {Promise<void>} A promise that resolves when the response is sent
 */
const getUnreadNotificationsCount = async (req, res) => {
  const userId = req.user.id;
  // get unread notifications
  const unreadNotifications = await notificationService.getUnreadNotifications(
    userId
  );
  const unreadNotificationsCount = unreadNotifications.length;
  const responseBody = {
    unreadCount: unreadNotificationsCount,
  };
  res.status(httpStatus.OK).json(responseBody);
};

export default {
  getNotifications,
  getUnreadNotificationsCount,
};
