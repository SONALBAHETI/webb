import logger from "../../../../config/logger.js";
import SendbirdAPIHandler from "./api.js";
import ApiError from "../../../../utils/ApiError.js";
import httpStatus from "http-status";

export const SendbirdChannelType = {
  GROUP: "group_channels",
  OPEN: "open_channels",
};

export default class SendbirdMessageHandler extends SendbirdAPIHandler {
  /**
   * Sends a text message to a channel.
   *
   * @param {object} options - Options for sending the message.
   * @param {string} options.channelType - The type of the channel.
   * @param {string} options.channelUrl - The URL of the channel.
   * @param {string} options.userId - The ID of the user sending the message.
   * @param {string} options.message - The text content of the message.
   * @param {SendMessageOptions} [options.options] - Additional options for sending the message.
   * @throws {ApiError} If the API request fails.
   * @returns {Promise<SendbirdTextMessage>} The message sent.
   */
  async sendTextMessage({
    channelType = SendbirdChannelType.GROUP,
    channelUrl,
    userId,
    message,
    options = {},
  }) {
    try {
      const response = await this.request.post(
        `/${channelType}/${channelUrl}/messages`,
        {
          message_type: "MESG",
          user_id: userId,
          message,
          ...options,
        }
      );
      return response.data;
    } catch (error) {
      logger.error(`Error sending message: ${error.response.data}`);
      throw new ApiError(
        httpStatus.FAILED_DEPENDENCY,
        "Failed to send message"
      );
    }
  }
}

/**
 * @typedef {import("./user.js").SendbirdUser} SendbirdUser
 */

/**
 * @typedef {Object} SendMessageOptions
 * @property {string} custom_type - Specifies a custom message type used for message grouping. The length is limited to 128 characters.
 * @property {string} data - Specifies additional message information. This property serves as a container for a long text of any type of characters which can also be a JSON-formatted string like {"font-size": "24px"}. More details on what can be stored in this field are available here.
 * @property {boolean} send_push - Determines whether to send a push notification of the message to the channel members. This property only applies to group channels. (Default: true)
 * @property {string} push_message_template - Specifies the content of a push notification customized for the message. This property only applies to group channels.
 * @property {string} mention_type - Specifies whether to mention specific users or all users in the channel. Acceptable values are users and channel. If set to users, up to ten users in the mentioned_user_ids property below are notified of the mention. If set to channel, up to ten users in the channel are notified of the mention. (Default: users)
 * @property {string[]} mentioned_user_ids - Specifies an array of IDs of the users to mention in the message. This property is used only when mention_type is users.
 * @property {boolean} is_silent - Determines whether to send a message without updating some of the following channel properties. If set to true, the channel's last_message is updated only for the sender while its unread_message_count remains unchanged for all channel members. Also, a push notification isn't sent to the users receiving the message. If the message is sent to a hidden channel, the channel still remains hidden. (Default: false)
 *  * Once the value of this property is set, it's irreversible.
 * @property {boolean} mark_as_read - Determines whether to mark the message as read for the sender. If set to false, the sender's unread_count and read_receipt remain unchanged after the message is sent. (Default: true)
 * @property {Object[]} sorted_metaarray - Specifies an array of JSON objects consisting of key-values items that store additional message information to be used for classification and filtering. Items are saved and returned in the order they've been specified. More details on what can be stored in this field are available here.
 * @property {number} created_at - Specifies the time when the message was sent in Unix milliseconds format. This property can be used when migrating messages from another system to the Sendbird server. If specified, the server sets the time of message creation as the property value.
 * @property {number} poll_id - Specifies the unique ID of the poll to be included in a message. To use this property, the polls feature should be turned on in Settings > Chat > Features on Sendbird Dashboard.
 * @property {boolean} include_poll_details - Determines whether to include all properties of a poll resource with a full list of options in the results. To use this property, the polls feature should be turned on in Settings > Chat > Features on Sendbird Dashboard.
 *  If set to false, a selection of poll resource properties consisting of id, title, close_at, created
 */

/**
 * @typedef {Object} SendbirdTextMessage
 * @property {number} message_id - The unique ID of the message.
 * @property {string} type - The type of the message. The value is MESG for a text message.
 * @property {string} custom_type - The custom message type used for message grouping. The length is limited to 128 characters.
 * @property {string} channel_url - The unique URL of the channel where the message is sent to.
 * @property {SendbirdUser} user - The user who sent the message.
 *  * This isn't updated in real-time, but it's a snapshot of the user object when a message object is created.
 * @property {string} mention_type - The mention type that indicates whether to call the attention of specific users or all users in the channel. The value of users indicates that up to ten users in mentioned_user_ids are notified of the mention, while the value of channel indicates that up to ten users in the channel are notified of the mention.
 * @property {SendbirdUser[]} mentioned_users - An array of users mentioned in the message.
 * @property {boolean} is_removed - Indicates whether the message is removed from the channel.
 * @property {string} message - The content of the message.
 * @property {Object} translations - The messages translated from the original language into one or more specified languages.
 * @property {string} data - Additional message information such as custom font size or font type in JSON or other formats. More details on what can be stored in this field are available here.
 * @property {Object[]} sorted_metaarray - An array of JSON objects consisting of key-values items to store additional message information which can be used for classification and filtering. When retrieving, items are returned in the order they were added. More details on what can be stored in this field are available here.
 * @property {Object} message_events - A set of events configured for each instance a message is sent or updated.
 *  * The events in this object are only supported in group channels.
 * @property {string} message_events.send_push_notification - Indicates which group of users to send push notifications to. Acceptable values are the following.
 *   - none: No push notifications are sent.
 *   - receivers: Push notifications are only sent to the intended recipients.
 *   - sender: A push notification is only sent to the sender.
 *   - all: Push notifications are sent to both the intended receivers and the sender.
 * @property {boolean} message_events.update_unread_count - Indicates whether to update unread_count for users in the channel. The update_mention_count property inside message_events inherits the value of update_unread_count.
 * @property {boolean} message_events.update_last_message - Indicates whether to update the last_message property of the channel if the updated message is the last message of the channel.
 * @property {Object} og_tag - The Open Graph (OG) metadata contained in the given URL when a text message or an admin message includes the URL of a web page. This consists of properties such as og:url, og:title, og:description, and og:image.
 * @property {number} created_at - The time when the message was sent in Unix milliseconds format.
 * @property {number} updated_at - The time when the message was updated in Unix milliseconds format.
 * @property {Object} file - The file contained in the message. This property is empty for any text messages.
 * @property {boolean} is_apple_critical_alert - Indicates whether the message is a critical alert.
 * @property {Object} [thread_info] - The thread information consisting of the reply count, most_replies, last_replied_at, and updated_at properties. The thread_info property is only retrieved if the message is a parent message.
 * @property {number} thread_info.reply_count - The total number of replies in the thread. The value of 0 indicates that there is no reply.
 * @property {Object[]} thread_info.most_replies - An array of one or more JSON objects containing the information of one or more users who replied the most. Up to five objects can be returned.
 * @property {number} thread_info.last_replied_at - The time when the last reply was added in Unix milliseconds format. The value of 0 indicates that there is no reply.
 * @property {number} thread_info.updated_at - The time when the thread information was updated due to a deleted or newly added reply in the thread, in Unix milliseconds format.
 * @property {number} parent_message_id - The unique ID of a thread's parent message. This property is only retrieved if the message is a reply.
 * @property {SendbirdTextMessage} parent_message_info - The information of the thread's parent message including the text, user information, and message type. This property is only retrieved if the message is a reply.  Refer to the {@link SendbirdTextMessage} definition for details on the properties.
 * @property {boolean} is_reply_to_channel - Indicates whether the message was sent as a reply to the channel.
 */
