import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { toJSON } from "./plugins/index.js";
import { roles } from "../config/roles.js";
import { Pronouns, Genders } from "../constants/index.js";
import { UserOccupationValues } from "../constants/onboarding.js";
import { generateTags, isTagFieldModified } from "../services/user.service.js";

const degreeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const certificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfIssue: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
});

const educationSchema = new mongoose.Schema({
  degrees: {
    type: [degreeSchema],
    default: [],
  },
  ceritificates: {
    type: [certificateSchema],
    default: [],
  },
  isResidencyTrained: {
    type: Boolean,
  },
  isFellowshipTrained: {
    type: Boolean,
  },
  residencyPrograms: {
    type: [String],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  fellowshipPrograms: {
    type: [String],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
});

const expertiseSchema = new mongoose.Schema({
  yearsInClinicalPractice: {
    type: Number,
    required: true,
  },
  commonlyTreatedDiagnoses: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  boardSpecialties: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  expertiseAreas: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  primaryInterests: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  practiceAreas: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
});

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
  },
  bio: {
    type: String,
  },
  primaryRole: {
    type: String,
  },
  pronouns: {
    type: String,
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
    enum: Object.values(Genders),
  },
  identity: String,
  ethnicity: String,
  personalInterests: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  religiousAffiliations: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  education: educationSchema,
  expertise: expertiseSchema,
  tags: {
    type: [String],
    default: [],
    index: true,
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
  sheerId: {
    verificationId: String,
    currentStep: String,
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
  getProfilePicture() {
    return this.profile?.picture;
  },
  getThreadId() {
    return this.integrations?.openai?.threadId;
  },
  getSheerIdStatus() {
    return this.integrations?.sheerId;
  },
  getDegrees() {
    return this.profile?.education?.degrees || [];
  },
  getPrimaryRole() {
    return this.profile?.primaryRole;
  },
  getGender() {
    return this.profile?.gender;
  },
  getPronouns() {
    return this.profile?.pronouns;
  },
  getEthnicity() {
    return this.profile?.ethnicity;
  },
  getIdentity() {
    return this.profile?.identity;
  },
  getReligiousAffiliations() {
    return this.profile?.religiousAffiliations || [];
  },
  getCertifications() {
    return this.profile?.education?.certificates || [];
  },
  getCommonlyTreatedDiagnoses() {
    return this.profile?.expertise?.commonlyTreatedDiagnoses || [];
  },
  getBoardSpecialties() {
    return this.profile?.expertise?.boardSpecialties || [];
  },
  getExpertiseAreas() {
    return this.profile?.expertise?.expertiseAreas || [];
  },
  getPracticeAreas() {
    return this.profile?.expertise?.practiceAreas || [];
  },
  getPrimaryInterests() {
    return this.profile?.expertise?.primaryInterests || [];
  },
  getPersonalInterests() {
    return this.profile?.personalInterests || [];
  },
  getYearsInClinicalPractice() {
    return this.profile?.expertise?.yearsInClinicalPractice;
  },
  isResidencyTrained() {
    return this.profile?.education?.isResidencyTrained || false;
  },
  isFellowshipTrained() {
    return this.profile?.education?.isFellowshipTrained || false;
  },
};

userSchema.pre("save", async function (next) {
  const user = this;
  // if user's password was updated, hash it
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  // if any of the tag fields have been modified, generate new tags
  if (user.isNew || isTagFieldModified(user)) {
    user.profile.tags = generateTags(user);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

export default User;
