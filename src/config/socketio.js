import { jwtStrategy } from "./passport.js";
import cookie from "cookie";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { Socket } from "socket.io";

/**
 * @type {Map<string, Array<Socket>>}
 * Map to store sockets by user id
 */
const socketsByUserId = new Map();

export const getSocketsByUserId = (userId) => {
  return socketsByUserId.get(userId) || [];
};

// Function to set cookies from socket headers
const setCookies = (socket) => {
  // Parsing cookies from socket headers
  const parsedCookies = cookie.parse(socket.request.headers.cookie);
  // Storing parsed cookies in socket request object
  socket.request.cookies = parsedCookies;
};

/**
 * Adds a socket to the socketsByUserId map for the given user
 * @param {String} userId Id of the user
 * @param {Socket} socket The connected socket
 */
const addSocket = (userId, socket) => {
  let sockets = getSocketsByUserId(userId);
  sockets.push(socket);
  socketsByUserId.set(userId, sockets);
};

/**
 * Removes a socket from the socketsByUserId map for the given user
 * @param {String} userId Id of the user
 * @param {Socket} socket The connected socket
 */
const removeSocket = (userId, socket) => {
  let sockets = getSocketsByUserId(userId);
  sockets = sockets.filter((s) => s.id !== socket.id);
  if (!sockets.length) {
    socketsByUserId.delete(userId);
  } else {
    socketsByUserId.set(userId, sockets);
  }
};

// Middleware function to authenticate socket connection
export const authenticateSocket = () => (socket, next) => {
  setCookies(socket);
  // Success callback for jwtStrategy
  jwtStrategy.success = function success(user) {
    // Storing user data in socket request object
    socket.request.user = user.toJSON();
    next();
  };
  // Fail callback for jwtStrategy
  jwtStrategy.fail = (_info) => {
    next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  };
  // Error callback for jwtStrategy
  jwtStrategy.error = (_error) =>
    next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));

  // Authenticating socket request using jwtStrategy
  jwtStrategy.authenticate(socket.request, {});
};

// initialize socket.io connection
const initializeSocketio = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.request.user.id;
    addSocket(userId, socket);
    console.log("sockets connected", socketsByUserId.size);

    // Event listener for socket disconnect
    socket.on("disconnect", () => {
      removeSocket(userId, socket);
      console.log("sockets connected", socketsByUserId.size);
    });
  });
};

export default initializeSocketio;
