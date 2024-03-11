import config from "../config/config.js";
import SendbirdGroupCallsHandler from "../providers/sendbird/modules/calls/groupCalls.js";

const sendbirdCallsHandler = new SendbirdGroupCallsHandler(
  config.sendBird.appId,
  config.sendBird.apiToken
);

/**
 * Creates a room in Sendbird.
 * @param {RoomType} [type] - The type of room to create.
 * @param {Object} [customItems] - Any custom metadata to add to the room.
 * @returns {Promise<{ room: Room }>} The created room
 */
const createSendbirdRoom = async (type, customItems) => {
  return sendbirdCallsHandler.createRoom(type, customItems);
};

export { createSendbirdRoom };

/**
 * @typedef {import("../providers/sendbird/modules/calls/groupCalls.js").RoomType} RoomType
 * @typedef {import("../providers/sendbird/modules/calls/groupCalls.js").Room} Room
 */
