import logger from "../../../config/logger.js";
import ApiError from "../../../utils/ApiError.js";
import { getErrorMessage } from "../common/errors.js";
import SheerIDVerificationHandler from "./verification.js";

class SheerIDHealthcareProfessionalVerificationHandler extends SheerIDVerificationHandler {
  constructor(accessToken, programId) {
    super(accessToken);
    this.programId = programId;
  }

  /**
   * Submits healthcare professional data against program
   *
   * @param {SubmitDataAgainstProgramParams} params - Parameters for submitting healthcare professional data against program
   * @return {Promise<SubmitDataResponse | DocUploadResponse>} The response from the API
   */
  async submitDataAgainstProgram(params) {
    try {
      const response = await this.request.post(
        `/verification/program/${this.programId}/step/collectMedicalProfessionalPersonalInfo`,
        params
      );
      return response.data;
    } catch (error) {
      const message =
        getErrorMessage(error.response?.data) || "An error occurred";
      logger.error(
        `Error submitting healthcare professional data against program: ${message}`
      );
      throw new ApiError(error.response.status, message);
    }
  }
}

export default SheerIDHealthcareProfessionalVerificationHandler;

/**
 * @typedef {"NURSE" | "DOCTOR" | "DENTIST" | "PHARMACIST" | "OTHER_HEALTH_WORKER"} Status
 * @typedef {"PENDING" | "FINISHED" | "ERROR"} DocumentUploadStatus
 * @typedef {"ZERO_SIZE" | "TOO_LARGE" | "UNSUPPORTED_TYPE" | "UNKNOWN"} DocumentUploadError
 * @typedef {"collectMedicalProfessionalPersonalInfo" | "docUpload" | "success" | "error" | "pending" | "consolation" | "override"} Step
 */

/**
 * @typedef {Object} Document
 * @property {string} documentId - A unique identifier of the document
 * @property {DocumentUploadStatus} status - The status of the document
 * @property {string} mimeType - The MIME type of the file to be uploaded
 * @property {number} fileSize - The size in bytes of the file to be uploaded
 * @property {string} [uploadUrl] - The URL to use to upload the file (using PUT). Only present if the document status is PENDING_UPLOAD.
 * @property {Array<DocumentUploadError>} errors - Any errors that were encountered
 */

/**
 * @typedef {Object} SubmitDataAgainstProgramParams
 * @property {string} firstName - The first name of the person being verified
 * @property {string} lastName - The last name of the person being verified
 * @property {string} email - The email address of the person being verified
 * @property {string} birthDate - The date of birth of the person being verified (format YYYY-MM-DD). Date must be greater than 1900-01-01.
 * @property {string} postalCode - The postal code for the person being verified
 * @property {Organization} organization - An organization that can be used for instant verification of various segments (Student, Teacher, Military, etc.)
 * @property {Array<Status>} statuses - List of medical professional statuses. A single value will be interpreted as a list with one entry.
 * @property {string} [deviceFingerprintHash] - The device fingerprint collected for the person being verified
 * @property {Status} [status] - The status of the person being verified
 * @property {string} [country] - The country code of the person being verified
 * @property {string} [phoneNumber] - The phone number used for SMS messages
 * @property {string} [memberId] - The unique member ID number for the person being verified
 * @property {string} locale - The locale chosen by the user
 * @property {string} [ipAddress] - Deprecated: The end-user's public IPv4 address. This only needs to be provided in situations where the HTTP requests do not come directly from the end-user.
 * @property {string} [ipAddressExtended] - The end-user's public IP address. This only needs to be provided in situations where the HTTP requests do not come directly from the end-user.
 * @property {string} [externalUserId] - An identifier stored with the verification for external reference
 * @property {string} [email2] - The second email address of the person being verified
 * @property {Object} [metadata] - A collection of custom metadata to be stored with the verification
 */

/**
 * @typedef {Object} Organization
 * @property {string} id - The unique identifier for the organization. This will be ignored if idExtended is specified.
 * @property {string} name - The name of the organization
 * @property {string} [idExtended] - The unique identifier for the Organization within the Organization service.
 * @property {"EMPLOYER" | "PLACE"} [source] - The name of the Organization
 */

/**
 * @typedef {Object} SubmitDataResponse
 * @property {string} verificationId - The unique ID for the VerificationRequest associated with this response
 * @property {Step} currentStep
 * @property {Array<Status>} availableStatuses - The list of statuses that are available for selection by the program
 * @property {string} [submissionUrl] - The URL to use for uploading documents
 * @property {Array<string>} [rejectionReasons] - The list of rejection reasons
 * @property {string} [maxReviewTime] - The maximum amount of time a review can take
 * @property {"A_FEW_MINUTES" | "A_HALF_HOUR" | "A_FEW_HOURS" | "A_FEW_DAYS"} [estimatedReviewTime] - The maximum amount of time a review can take
 * @property {Array<string>} [errorIds] - The list of errors that occurred, if any
 * @property {import("./verification.js").Segment} [segment]
 * @property {import("./verification.js").SubSegment} [subSegment]
 * @property {string} [locale]
 * @property {string} [country]
 * @property {Array<Document>} [documents] - A list of documents for which upload has been initiated but not completed.
 */
/**
 * @typedef {Object} DocUploadResponse
 * @property {string} verificationId
 * @property {string} currentStep
 * @property {Array<string>} errorIds
 * @property {string} segment
 * @property {string} subSegment
 * @property {string} locale
 * @property {string} submissionUrl
 * @property {Array<string>} rejectionReasons
 */
