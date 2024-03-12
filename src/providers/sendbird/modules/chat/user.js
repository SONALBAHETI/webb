import logger from "../../../../config/logger.js";
import SendbirdAPIHandler from "./api.js";

class SendbirdUserHandler extends SendbirdAPIHandler {
  /**
   * Retrieves list of sendbird users
   * @returns {Promise<{ users: SendbirdUser[] }>} An object containing an array of users.
   */
  async getUsers() {
    try {
      const response = await this.request.get(`/users`);
      return response.data;
    } catch (error) {
      logger.error(`Error getting users: ${error.response.data}`);
      throw error;
    }
  }

  /**
   * Creates a new sendbird user
   * @param {Object} userParams - User parameters
   * @returns {Promise<SendbirdUser>} The created sendbird user
   */
  async createUser(userParams) {
    try {
      const response = await this.request.post(`/users`, userParams);
      return response.data;
    } catch (error) {
      logger.error(`Error creating user: ${error.response.data}`);
      throw error;
    }
  }

  // Add more user-specific methods as needed
}

export default SendbirdUserHandler;

/**
 * @typedef {Object} SendbirdUser
 * @property {string} user_id - A user's unique ID. The length is limited to 80 characters.
 * @property {string} nickname - A user's nickname. The length is limited to 80 characters.
 * @property {string} profile_url - The URL of a user's profile image. If left empty, no profile image is set for the user. The length is limited to 2,048 characters.
 * @property {string} access_token - An opaque string that identifies the user. It is recommended that every user has their own access token and provides it upon login for security.
 * @property {boolean} has_ever_logged_in - Indicates whether the user has ever logged into the application.
 * @property {boolean} is_active - Indicates whether the user is active within the Sendbird application.
 *  * Monthly Active Users (MAU) isn't calculated based on this property.
 * @property {boolean} is_online - Indicates whether the user is connected to the Sendbird server.
 * @property {string[]} discovery_keys - An array of unique keys of the user, which is provided to Sendbird server when searching for friends. The unique key acts as an identifier for users' friends to find each other. The server uses discovery keys to identify and match the user with other users.
 * @property {string[]} preferred_languages - An array of one or more language codes to translate notification messages to preferred languages. Up to four languages can be set for the user. If messages are sent in one of the preferred languages, notification messages won't be translated. If messages are sent in a language other than the preferred languages, notification messages are translated into the first language in the array. Messages translated into other preferred languages are provided in the sendbird property of the notification message payload.
 * @property {number} created_at - The time that the user was created in Unix milliseconds format.
 * @property {number} last_seen_at - The time the user went offline in Unix milliseconds format to indicate when the user was last connected to the Sendbird server. If the user is online, the value is set as 0. If the user is offline and there's no last_seen_at data, the value is set as -1. This property isn't tracked by default.
 * @property {Object} metadata - A JSON object of one or more key-value items to store additional user information such as their preference settings. For more information, see the managing metadata page.
 *  * Do not use PII (Personally Identifiable Information) such as user email address, legal name, or phone number as it could jeopardize data security and privacy.
 * @property {boolean} [is_blocking_me] - Indicates whether the listed user is blocking the user specified in the user_id parameter.
 *  *Only included in the members[] property when user_id is specified.
 * @property {boolean} [is_blocked_by_me] - Indicates whether the listed user is blocked by the user specified in the user_id parameter.
 *  *Only included in the members[] property when user_id is specified.
 */
