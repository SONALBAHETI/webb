import mongoose from "mongoose";
import validator from "validator";
import { toJSON } from "./plugins/index.js";
import { UserOccupationValues } from "../constants/onboarding.js";
import userTrigger from "../triggers/user.trigger.js";
import achievementsSchema from "./schemas/user/achievements.schema.js";
import statsSchema from "./schemas/user/stats.schema.js";
import profileSchema from "./schemas/user/profile.schema.js";
import integrationsSchema from "./schemas/user/integrations.schema.js";
import accountStatusSchema from "./schemas/user/accountStatus.schema.js";
import availabilitySchema from "./schemas/user/availability.schema.js";
import accessControlSchema from "./schemas/user/accessControl.schema.js";
import userMethods from "./methods/user.methods.js";

/**
 * @typedef {Object} UserSchema
 * @property {string} name - The user's name
 * @property {string} email - The user's email
 * @property {string} [password] - The user's password
 * @property {string} role - The user's role
 * @property {string} [occupation] - The user's occupation
 * @property {AccountStatusSchema} accountStatus - The user's account status
 * @property {ProfileSchema} [profile] - The user's profile
 * @property {IntegrationsSchema} integrations - The user's integrations
 * @property {AvailabilitySchema} [availability] - The user's availability
 * @property {AchievementsSchema} [achievements] - The user's achievements
 * @property {AccessControlSchema} accessControl - The user's access control
 * @property {StatsSchema} [stats] - The user's stats
 * @property {number} creditBalance - The user's credit balance
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    accessControl: {
      type: accessControlSchema,
      private: true,
      default: {},
    },
    occupation: {
      type: String,
      enum: UserOccupationValues,
    },
    accountStatus: {
      type: accountStatusSchema,
      private: true,
      default: {},
    },
    availability: availabilitySchema,
    profile: profileSchema,
    achievements: achievementsSchema,
    stats: statsSchema,
    integrations: {
      type: integrationsSchema,
      private: true,
      default: {},
    },
    creditBalance: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

userSchema.statics = {
  /**
   * Check if email is taken
   * @param {string} email - The user's email
   * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
   * @returns {Promise<boolean>}
   */
  async isEmailTaken(email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  },
};

userSchema.methods = userMethods;

// plug in user trigger
userSchema.plugin(userTrigger);

/**
 * @typedef {UserSchema & mongoose.Document & UserMethods} User
 */
const User = mongoose.model("User", userSchema);

export { userSchema };
  
export default User;

/**
 * @typedef {import("./schemas/user/degree.schema.js").DegreeSchema} DegreeSchema
 * @typedef {import("./schemas/user/certificate.schema.js").CertificateSchema} CertificateSchema
 * @typedef {import("./schemas/user/education.schema.js").EducationSchema} EducationSchema
 * @typedef {import("./schemas/user/expertise.schema.js").ExpertiseSchema} ExpertiseSchema
 * @typedef {import("./schemas/user/badge.schema.js").BadgeSchema} BadgeSchema
 * @typedef {import("./schemas/user/achievements.schema.js").AchievementsSchema} AchievementsSchema
 * @typedef {import("./schemas/user/stats.schema.js").StatsSchema} StatsSchema
 * @typedef {import("./schemas/user/profile.schema.js").ProfileSchema} ProfileSchema
 * @typedef {import("./schemas/user/integrations.schema.js").IntegrationsSchema} IntegrationsSchema
 * @typedef {import("./schemas/user/accountStatus.schema.js").AccountStatusSchema} AccountStatusSchema
 * @typedef {import("./schemas/user/availability.schema.js").SlotSchema} SlotSchema
 * @typedef {import("./schemas/user/availability.schema.js").DayScheduleSchema} DayScheduleSchema
 * @typedef {import("./schemas/user/availability.schema.js").WeeklyScheduleSchema} WeeklyScheduleSchema
 * @typedef {import("./schemas/user/availability.schema.js").AvailabilitySchema} AvailabilitySchema
 * @typedef {import("./schemas/user/accessControl.schema.js").AccessControlSchema} AccessControlSchema
 * @typedef {import("./methods/user.methods.js").UserMethods} UserMethods
 */
