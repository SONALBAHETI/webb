import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { toJSON } from "./plugins/index.js";
import { roles } from "../config/roles.js";
import { Pronouns, Genders } from "../constants/index.js";
import { UserOccupationValues } from "../constants/onboarding.js";
import userTrigger from "../triggers/user.trigger.js";

/**
 * @typedef {Object} Degree
 * @property {string} name - The name of the degree
 * @property {string} institution - The name of the institution
 * @property {Date} dateOfCompletion - The date of completion
 */
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
  dateOfCompletion: {
    type: Date,
    required: true,
  },
});

/**
 * @typedef {Object} Certificate
 * @property {string} name - The name of the certificate
 * @property {Date} dateOfIssue - The date of issue
 * @property {Date} [expirationDate] - The expiration date
 */
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
  },
});

/**
 * @typedef {Object} Education
 * @property {Array<Degree>} [degrees] - The list of degrees
 * @property {Array<Certificate>} [certificates] - The list of certificates
 * @property {boolean} [isResidencyTrained] - Whether the user has trained for a residency
 * @property {boolean} [isFellowshipTrained] - Whether the user has trained for a fellowship
 * @property {Array<string>} [residencyPrograms] - The list of residency programs
 * @property {Array<string>} [fellowshipPrograms] - The list of fellowship programs
 */
const educationSchema = new mongoose.Schema({
  degrees: {
    type: [degreeSchema],
    default: [],
  },
  certificates: {
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

/**
 * @typedef {Object} Expertise
 * @property {number} [yearsInClinicalPractice] - The number of years in clinical practice
 * @property {Array<string>} [commonlyTreatedDiagnoses] - The list of commonly treated diagnoses
 * @property {Array<string>} [boardSpecialties] - The list of board specialties
 * @property {Array<string>} [expertiseAreas] - The list of expertise areas
 * @property {Array<string>} [practiceAreas] - The list of practice areas
 */
const expertiseSchema = new mongoose.Schema({
  yearsInClinicalPractice: Number,
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
  practiceAreas: {
    type: [String],
    default: [],
    index: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
});

/**
 * @typedef {Object} Badge
 * @property {string} name - The name of the badge
 * @property {string} description - The description of the badge
 * @property {string} icon - The icon of the badge
 */
const badgeSchema = new mongoose.Schema(
  {
    originalBadge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

badgeSchema.plugin(toJSON);

/**
 * @typedef {Object} Achievements
 * @property {Array<Badge>} [badges] - The list of badges
 */
const achievementsSchema = new mongoose.Schema({
  badges: {
    type: [badgeSchema],
    default: [],
  },
});

achievementsSchema.plugin(toJSON);

/**
 * @typedef {Object} Stats
 * @property {number} [hoursLearned] - The number of hours learned
 * @property {number} [hoursMentored] - The number of hours mentored
 * @property {number} [chatMessagesSent] - The number of chat messages sent
 * @property {number} [chatMessagesRead] - The number of chat messages received
 * @property {number} [videoSessions] - The number of video sessions
 * @property {number} [averageRatings] - The average rating
 * @property {number} [averageResponseTime] - The average response time
 * @property {number} [averageResponseRate] - The average response rate
 */
const statsSchema = new mongoose.Schema({
  hoursLearned: {
    type: Number,
    default: 0,
  },
  hoursMentored: {
    type: Number,
    default: 0,
  },
  chatMessagesSent: {
    type: Number,
    default: 0,
  },
  chatMessagesRead: {
    type: Number,
    default: 0,
  },
  videoSessions: {
    type: Number,
    default: 0,
  },
  averageRatings: {
    type: Number,
    default: 0,
  },
  averageResponseTime: {
    type: Number,
    default: 0,
  },
  averageResponseRate: {
    type: Number,
    default: 0,
  },
});

/**
 * @typedef {Object} Profile
 * @property {string} firstName - The user's first name
 * @property {string} lastName - The user's last name
 * @property {string} [picture] - The user's picture
 * @property {string} [bio] - The user's bio
 * @property {string} [primaryRole] - The user's primary role
 * @property {string} [pronouns] - The user's pronouns
 * @property {string} [gender] - The user's gender
 * @property {Date} [dateOfBirth] - The user's date of birth
 * @property {string} [state] - The user's state
 * @property {string} [postalCode] - The user's postal code
 * @property {string} [funFact] - The user's fun fact
 * @property {string} [identity] - The user's identity
 * @property {string} [ethnicity] - The user's ethnicity
 * @property {Array<string>} [personalInterests] - The user's personal interests
 * @property {Array<string>} [primaryInterests] - The user's primary interests
 * @property {Array<string>} [religiousAffiliations] - The user's religious affiliations
 * @property {Education} [education] - The user's education
 * @property {Expertise} [expertise] - The user's expertise
 * @property {Array<string>} [tags] - tags
 */
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
  picture: String,
  bio: String,
  primaryRole: String,
  pronouns: {
    type: String,
    enum: Object.values(Pronouns),
  },
  gender: {
    type: String,
    trim: true,
    enum: Object.values(Genders),
  },
  dateOfBirth: Date,
  state: String,
  postalCode: String,
  funFact: String,
  identity: String,
  ethnicity: String,
  personalInterests: {
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
    private: true,
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
});

profileSchema.plugin(toJSON);

/**
 * @typedef {Object} OpenAIIntegration
 * @property {string} [threadId] - The OpenAI thread ID
 */
/**
 * @typedef {Object} GoogleIntegration
 * @property {string} [userId] - The Google user ID
 */
/**
 * @typedef {Object} SendbirdIntegration
 * @property {string} [userId] - The Sendbird user ID
 */
/**
 * @typedef {Object} SheerIDIntegration
 * @property {string} [verificationId] - The SheerID verification ID
 * @property {string} [currentStep] - The current step of the verification
 */
/**
 * @typedef {Object} Integrations
 * @property {OpenAIIntegration} [openai] - The OpenAI integration
 * @property {GoogleIntegration} [google] - The Google integration
 * @property {SendbirdIntegration} [sendbird] - The Sendbird integration
 * @property {SheerIDIntegration} [sheerId] - The SheerID integration
 */
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

/**
 * @typedef {Object} AccountStatus
 * @property {boolean} [isEmailVerified] - Whether the user's email has been verified
 * @property {boolean} [isOnboarded] - Whether the user has been onboarded
 */
const statusSchema = new mongoose.Schema({
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isOnboarded: {
    type: Boolean,
    default: false,
  },
});

/**
 * @typedef {Object} User
 * @property {string} name - The user's name
 * @property {string} email - The user's email
 * @property {string} [password] - The user's password
 * @property {string} [role] - The user's role
 * @property {string} [occupation] - The user's occupation
 * @property {AccountStatus} [accountStatus] - The user's account status
 * @property {Profile} [profile] - The user's profile
 * @property {Object} [integrations] - The user's integrations
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
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    occupation: {
      type: String,
      enum: UserOccupationValues,
    },
    accountStatus: statusSchema,
    profile: profileSchema,
    achievements: achievementsSchema,
    stats: statsSchema,
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
  /**
   * @returns {SheerIDIntegration} The SheerID integration
   */
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
  getBadges() {
    return this.achievements?.badges || [];
  },
  getStats() {
    return this.stats || {};
  },
  getAchievements() {
    return this.achievements || {};
  },
  isResidencyTrained() {
    return this.profile?.education?.isResidencyTrained || false;
  },
  isFellowshipTrained() {
    return this.profile?.education?.isFellowshipTrained || false;
  },
};

// plug in user trigger
userSchema.plugin(userTrigger);

const User = mongoose.model("User", userSchema);

export { userSchema };
export default User;
