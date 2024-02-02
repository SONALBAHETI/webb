import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { toJSON } from "./plugins/index.js";
import { roles } from "../config/roles.js";
import { Pronouns, Genders } from "../constants/index.js";
import { UserOccupationValues } from "../constants/onboarding.js";

const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  picture: {
    type: String,
    trim: true,
  },
  pronouns: {
    type: String,
    trim: true,
    enum: [
      Pronouns.HE,
      Pronouns.SHE,
      Pronouns.THEY,
      Pronouns.OTHER,
      Pronouns.NONE,
    ],
  },
  gender: {
    type: String,
    trim: true,
    enum: [Genders.MALE, Genders.FEMALE, Genders.OTHER, Genders.NONE],
  },
});

const privateInfoSchema = new mongoose.Schema({
  expertiseAreas: {
    type: [String],
    trim: true,
    default: [],
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  primaryInterests: {
    type: [String],
    trim: true,
    default: [],
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  practiceAreas: {
    type: [String],
    trim: true,
    default: [],
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
});

const integrationsSchema = new mongoose.Schema({
  openai: {
    threadId: String,
  },
  google: {
    userId: String,
  },
  sendbird: {
    userId: String,
  },
});

const stasusSchema = new mongoose.Schema({
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isOnboarded: {
    type: Boolean,
    default: false,
  },
});

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
      trim: true,
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
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    occupation: {
      type: String,
      enum: UserOccupationValues,
    },
    accountStatus: stasusSchema,
    profile: profileSchema,
    privateInfo: {
      type: privateInfoSchema,
      private: true,
    },
    integrations: {
      type: integrationsSchema,
      private: true,
    },
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

userSchema.methods = {
  /**
   * Check if password matches the user's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async isPasswordMatch(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
  },
  getThreadId() {
    return this.integrations?.openai?.threadId;
  },
};

userSchema.pre("save", async function (next) {
  const user = this;
  // if user's password was updated, hash it
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

export default User;
