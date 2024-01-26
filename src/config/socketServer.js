import { createServer } from "http";
import { Server } from "socket.io";
import initializeSocketio, { authenticateSocket } from "./socketio.js";
import express from "express";
import config from "./config.js";

/**
 * Creates and configures a socket server
 * @param {express.Express} app - The express app
 * @returns {Object} - The created server
 */
const socketServer = (app) => {
  // Create an HTTP server
  const socServer = createServer(app);

  // Create a new socket.io server and configure it
  const io = new Server(socServer, {
    transports: ["websocket"],
    cors: { origin: config.frontendBaseUrl },
  });

  // Middleware to set cookies on the socket request
  io.use(authenticateSocket());

  // Initialize socket.io functionality (connection and disconnection)
  initializeSocketio(io);

  return socServer;
};

export default socketServer;
