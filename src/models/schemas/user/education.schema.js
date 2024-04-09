import mongoose from "mongoose";
import certificateSchema from "./certificate.schema.js";
import degreeSchema from "./degree.schema.js";

/**
 * @typedef {Object} EducationSchema
 * @property {Array<import("./degree.schema.js").DegreeSchema>} degrees - The list of degrees
 * @property {Array<import("./certificate.schema.js").CertificateSchema>} certificates - The list of certificates
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
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
  fellowshipPrograms: {
    type: [String],
    set: (value) => value?.map((i) => i.toLowerCase()),
  },
});

export default educationSchema;