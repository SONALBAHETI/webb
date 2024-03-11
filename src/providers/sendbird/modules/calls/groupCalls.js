import httpStatus from "http-status";
import logger from "../../../../config/logger.js";
import ApiError from "../../../../utils/ApiError.js";
import SendbirdCallsAPIHandler from "./api.js";

export const RoomType = {
  LARGE: "large_room_for_audio_only",
  SMALL: "small_room_for_video",
};

class SendbirdGroupCallsHandler extends SendbirdCallsAPIHandler {
  /**
   * Creates a room in Sendbird.
   * @param {RoomType} type - The type of room to create.
   * @param {Object} [customItems] - Any custom metadata to add to the room.
   * @returns {Promise<{ room: Room }>} The created room
   */
  async createRoom(type = RoomType.SMALL, customItems) {
    try {
      const response = await this.request.post(`/rooms`, {
        type: type,
        custom_items: customItems,
      });
      return response.data;
    } catch (error) {
      logger.error(`Error creating room: ${error.response.data}`);
      throw new ApiError(httpStatus.FAILED_DEPENDENCY, "Failed to create room");
    }
  }

  async deleteRoom(roomId) {
    try {
      const response = await this.request.delete(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error deleting room: ${error.response.data}`);
      throw new ApiError(httpStatus.FAILED_DEPENDENCY, "Failed to delete room");
    }
  }
}

export default SendbirdGroupCallsHandler;


/**
 * Represents a room in Sendbird.
 * @typedef {Object} Room
 * @property {string} room_id - A unique identifier for the room.
 * @property {RoomType} room_type - The type of a room. A type indicates the room type as audio or video and the capacity of a room. Valid values are large_room_for_audio_only which can hold up to 100 participants and small_room_for_video which can hold up to 6 participants.
 * @property {number} created_at - The timestamp of when the room was created, in Unix milliseconds.
 * @property {number} updated_at - The timestamp of when the room information was updated, in Unix milliseconds.
 * @property {string} state - The state of the room. Valid values are the following:
 *  - Open: Indicates that users can enter the room to participate in a group call.
 *  - Deleted: Indicates that users can't enter the room and the room can't be reopened.
 * @property {string} created_by - The user ID of the user who created the room. If the room is created with the Platform API, an empty string will be returned.
 * @property {string} deleted_by - The user ID of the user who deleted the room. If the room is deleted with the Platform API, an empty string will be returned.
 * @property {Participant[]} current_participants - The users who are currently in the room.
 * @property {Object} custom_items - Specifies a JSON object that has custom key-value items to add. The key and value must be a string and its length is limited to 128 characters. This parameter can have up to 10 custom items.
 */

/**
 * @typedef {"large_room_for_audio_only" | "small_room_for_video"} RoomType
 */

/**
 * Represents a participant in a Sendbird SDK room.
 * @typedef {Object} Participant
 * @property {string} room_id - A unique identifier for the room.
 * @property {string} participant_id - A unique identifier for the participant.
 * @property {number} entered_at - The timestamp of when the participant entered the room, in Unix milliseconds.
 * @property {number} updated_at - The timestamp of when the participant information was updated within the room, in Unix milliseconds.
 * @property {number|null} exited_at - The timestamp of when the participant exited the room, in Unix milliseconds. This value is null until the participant leaves the room.
 * @property {number|null} duration - The period from the time when the participant entered the room to the time the participant left the room, measured in seconds. This value is null until the participant leaves the room.
 * @property {number|null} connected_at - The timestamp of when the participant was connected and streaming media in the room, in Unix milliseconds. This value is null until the participant leaves the room.
 * @property {string} client_id - The unique ID of the client.
 * @property {"entered" | "connected" | "exited"} state - The state of the participant. Valid values are the following:
 *  - entered: Indicates that a participant entered the room.
 *  - connected: Indicates that a participant is connected and streaming media.
 *  - exited: Indicates that a participant exited the room.
 * @property {Object} user - The user who can access all features of the room.
 * @property {boolean} is_audio_on - Indicates whether the participant has turned on their audio.
 * @property {boolean} is_video_on - Indicates whether the participant has turned on their video.
 */
