import mongoose from "mongoose";
import { toJSON } from "../../plugins/index.js";
import { Pronouns } from "../../../constants/pronouns.js";
import { Genders } from "../../../constants/genders.js";
import educationSchema from "./education.schema.js";
import expertiseSchema from "./expertise.schema.js";

/**
 * @typedef {Object} ProfileSchema
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
 * @property {Array<string>} personalInterests - The user's personal interests
 * @property {Array<string>} primaryInterests - The user's primary interests
 * @property {Array<string>} religiousAffiliations - The user's religious affiliations
 * @property {Education} [education] - The user's education
 * @property {Expertise} [expertise] - The user's expertise
 * @property {Array<string>} tags - tags
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

export default profileSchema;