import mongoose from "mongoose";

/**
 * @typedef {Object} CertificateSchema
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

export default certificateSchema;