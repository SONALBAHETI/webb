import { userSchema } from "../models/user.model.js";
import { generateTags, isTagFieldModified } from "../services/user.service.js";
import processAsync from "../utils/processAsync.js";
import gamifyService from "../services/gamify.service.js";
import bcrypt from "bcrypt";

/**
 * User trigger plugin
 * @param {userSchema} schema
 */
const userTrigger = (schema) => {


  // pre "save" trigger
  schema.pre("save", async function (next) {
    const user = this;

    // if user's password was updated, hash it
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }

    // if any of the tag fields have been modified, generate new tags
    if (user.isNew || isTagFieldModified(user)) {
      user.profile.tags = generateTags(user);
    }

    // if user has sent 20 chat messages, assign badge
    if (
      user.isModified("stats.chatMessagesSent") &&
      user.stats.chatMessagesSent === 27
    ) {
      processAsync(async () => {
        await gamifyService.assignBadge(user.id, "65e6fa1bb8dff13abea6020a");
      });
    }
    next();
  });
};

export default userTrigger;
