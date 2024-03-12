import logger from "../../../../config/logger.js";
import SendbirdAPIHandler from "./api.js";
import ApiError from "../../../../utils/ApiError.js";
import httpStatus from "http-status";
import { validateArrayOfStrings } from "../../../../utils/validators.js";

export default class SendbirdGroupChannelHandler extends SendbirdAPIHandler {
  /**
   * Creates a group channel in Sendbird.
   *
   * @param {string[]} user_ids - An array of user IDs.
   * @param {CreateGroupChannelOptions} [options] - Options for creating the group channel.
   * @throws {ApiError} If the API request fails.
   * @throws {ValidationError} If the user_ids parameter is not valid.
   * @returns {Promise<GroupChannel>} The created group channel.
   */
  async createGroupChannel(user_ids, options = {}) {
    validateArrayOfStrings(user_ids, "user_ids");
    try {
      options = {
        is_distinct: true,
        block_sdk_user_channel_join: true,
        ...options,
      };
      const response = await this.request.post(`/group_channels`, {
        user_ids,
        ...options,
      });
      return response.data;
    } catch (error) {
      logger.error(`Error creating group channel: ${error.response.data}`);
      throw new ApiError(
        httpStatus.FAILED_DEPENDENCY,
        "Failed to create group channel"
      );
    }
  }
}

/**
 * @typedef {Object} CreateGroupChannelOptions - Options for creating a group channel.
 * @property {string} [options.name] - Specifies the name of the channel, or the channel topic. The length is limited to 191 characters. (Default: "group channel")
 * @property {string} [options.channel_url] - Specifies the URL of the channel. Only numbers, letters, underscores, and hyphens are allowed. The allowed length is 4 to 100 characters, inclusive. If not specified, a URL is automatically generated.
 * @property {string} [options.cover_url] - Specifies the URL of the channel's cover image. This should be no longer than 2,048 characters.
 * @property {File} [options.cover_file] - Uploads an image file of your choice to be used as the channel's cover image.
 * @property {string} [options.custom_type] - Specifies a custom channel type which is used for channel grouping. Maximum length is 128 characters.
 * @property {string} [options.data] - Additional channel information such as a long description of the channel or JSON formatted string.
 * @property {boolean} [options.is_distinct=true] - Determines whether to reuse an existing channel or create a new channel when attempting to create a channel with the same group of members.
 * @property {boolean} [options.is_public=false] - Determines whether to allow users to join the channel without an invitation.
 * @property {boolean} [options.is_super=false] - Determines whether to allow the channel to accommodate 100 or more members.
 * @property {boolean} [options.is_ephemeral=false] - Determines whether to preserve messages in the channel for the purpose of retrieving chat history.
 * @property {string} [options.access_code] - Specifies an access code that is only applicable to public group channels.
 * @property {string} [options.inviter_id] - Specifies the ID of a user who invites other users to the channel.
 * @property {boolean} [options.strict=false] - Determines whether to receive a 400111 error and cease channel creation when there are invalid users.
 * @property {Object} [options.invitation_status] - Specifies the invitation status of each user invited to the channel.
 * @property {Object} [options.hidden_status] - Specifies the channel's hidden status for each user.
 * @property {string[]} [options.operator_ids] - Specifies an array of user IDs to register as operators of the channel.
 * @property {boolean} [options.block_sdk_user_channel_join=false] - Determines whether to block users from joining the channel through the Chat SDK.
 */

/**
 * @typedef {Object} GroupChannel
 * @property {string} name - The name of the channel or the channel topic.
 * @property {string} channel_url - The unique URL of the channel.
 * @property {string} cover_url - The URL of the cover image.
 * @property {string} custom_type - A custom channel type which is used for channel grouping.
 * @property {string} data - A string data which can contain additional channel information such as a long description of the channel or JSON formatted string.
 * @property {boolean} is_distinct - Indicates whether an existing channel is reused or a new channel has been created with a combination of the channel members as well as the custom channel type if specified.
 * @property {boolean} is_public - Indicates whether to allow a user to join the channel without an invitation.
 * @property {boolean} is_super - Indicates whether the channel is a group channel or a Supergroup channel.
 * @property {boolean} is_ephemeral - Indicates whether to preserve the messages in the channel for the purpose of retrieving chat history.
 * @property {boolean} is_access_code_required - Indicates whether to set an access code to the channel and require an access code to a user who attempts to join the channel.
 * @property {number} member_count - The number of all members who have joined the channel and who have been invited but not joined.
 * @property {number} joined_member_count - The number of members who have joined the channel only.
 * @property {Array<Object>} members - An array of users who are members of the group channel.
 * @property {Array<Object>} operators - An array of users registered as operators of the channel. The operators can ban, mute, or delete messages in the channel that they join as an operator.
 * @property {Object} delivery_receipt - The timestamp of when the user has last received the messages in the channel, in Unix milliseconds. Each key-value pair has a key with the unique ID of a user and a values with the user's timestamp.
 * @property {Object} read_receipt - The timestamps of when the user has last read the messages in the channel, in Unix milliseconds. Each key-value pair has a key with the unique ID of a user and a value with the user’s timestamp.
 * @property {number} max_length_message - The maximum length of a message allowed to be sent within the channel. This is the same as a value of the max_message_length property in the global application settings.
 * @property {number} unread_message_count - The number of messages a specific user hasn't read in the channel. If not specified, the value of 0 returns. However, if you specify a user in the request when using an API such as list group channels by user, the value isn't 0.
 * @property {number} unread_mention_count - The number of messages in the channel a specific user is mentioned in but hasn't read. If a user isn't specified in the request, the value returns 0. However, if you specify a user in the request when using an API such as list group channels by user, the value isn't 0.
 * @property {Object} last_message - The latest message sent to the channel.
 * @property {Object} created_by - Information about the user who has created the channel and invited other users as members to the channel.
 * @property {number} created_at - The timestamp of when the channel was created, in Unix milliseconds format.
 * @property {boolean} freeze - Indicates whether the channel is currently frozen. The value of true indicates that only operators can send messages to the channel.
 */
