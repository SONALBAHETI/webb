import logger from "../../../config/logger.js";
import ApiError from "../../../utils/ApiError.js";
import { getErrorMessage } from "../common/errors.js";
import SheerIDVerificationHandler from "./verification.js";

class SheerIDStudentVerificationHandler extends SheerIDVerificationHandler {
  constructor(accessToken, programId) {
    super(accessToken);
    this.programId = programId;
  }

  /**
   * Submits student data against program
   * @param {SubmitDataAgainstProgramParams} params - Parameters for submitting student data against program
   * @throws {ApiError} If the API request fails
   * @returns {Promise<StudentVerificationResponse>} The response from the API
   */
  async submitDataAgainstProgram(params) {
    try {
      const response = await this.request.post(
        `/verification/program/${this.programId}/step/collectStudentPersonalInfo`,
        params
      );
      logger.info("verification data response", response.data);
      return response.data;
    } catch (error) {
      const message =
        getErrorMessage(error.response?.data) || "An error occurred";
      logger.error(`Error submitting student data against program: ${message}`);
      throw new ApiError(error.response.status, message);
    }
  }
}

export default SheerIDStudentVerificationHandler;


/* Type definitions */

/**
 * @typedef {Object} SubmitDataAgainstProgramParams
 * @property {string} firstName - The first name of the person being verified (required).
 * @property {string} lastName - The last name of the person being verified (required).
 * @property {string} email - The email address of the person being verified (required). Must be a valid email format.
 * @property {string} birthDate - The date of birth of the person being verified (required) in YYYY-MM-DD format. Date must be greater than 1900-01-01.
 * @property {import("./healthcareProfessionalVerification.js").Organization} organization - An organization that can be used for instant verification (required). Refer to the {@link Organization} definition for details on the properties.
 * @property {string} [deviceFingerprintHash] - The device fingerprint collected for the person being verified.
 * @property {string} [ipAddressExtended] - The end-user's public IP address (IPv4 or IPv6 format). Only needed if requests don't come directly from the user.
 * @property {string} [externalUserId] - An identifier stored with the verification for external reference.
 * @property {string} [email2] - The secondary email address of the person being verified (valid email format).
 * @property {string} [phoneNumber] - The phone number used for SMS messages (valid phone number format).
 * @property {string} [locale] - The locale chosen by the user (valid locale format).
 * @property {Object} [metadata] - A collection of custom metadata to be stored with the verification. Property names are strings with a maximum length of 10000 characters.
 * */

/**
 * @typedef {Object} StudentVerificationResponse
 * @property {string} verificationId - The unique ID for the VerificationRequest associated with this response.
 * @property {VerificationStep} currentStep - The current step in the verification process. Refer to the {@link VerificationStep} definition for possible values.
 * @property {string} [redirectUrl] - The URL to use for redirecting the verified user once a reward has been given.
 * @property {Object} [rewardData] - A collection of all reward codes and values stored in the verification.
 * @property {ErrorId[]} [errorIds] - The list of errors that occurred, if any. Refer to the {@link ErrorId} definition for possible values.
 * @property {"student"} segment - The market segment being verified
 * @property {import("./verification.js").SubSegment} subSegment - The subsegment being verified 
 * @property {string} [submissionUrl] - The URL to use for uploading documents
 * @property {Array<string>} [rejectionReasons] - The list of rejection reasons
 * @property {string} [maxReviewTime] - The maximum amount of time a review can take
 * @property {"A_FEW_MINUTES" | "A_HALF_HOUR" | "A_FEW_HOURS" | "A_FEW_DAYS"} [estimatedReviewTime] - The maximum amount of time a review can take
 * @property {string} locale - The locale chosen by the user.
 * @property {string} country - The country code of the person being verified.
 * @property {number} created - Timestamp representing when the verification was created.
 * @property {number} updated - Timestamp representing when the verification was last updated.
 * @property {Array<Document>} [documents] - A list of documents for which upload has been initiated but not completed.
 *
 * VerificationStep Enum
 * @typedef {"collectStudentPersonalInfo" | "docUpload" | "success" | "error" | "pending" | "emailLoop" | "smsLoop" | "consolation" | "override"} VerificationStep
 * @typedef {import("../common/errors.js").ErrorId} ErrorId
 */
