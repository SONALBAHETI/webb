import httpStatus from "http-status";
import logger from "../../../config/logger.js";
import ApiError from "../../../utils/ApiError.js";
import SheerIDVerificationHandler from "./verification.js";

/**
 * @typedef {Object} SheerIDFile
 * @property {string} fileName - The name of the file
 * @property {string} mimeType - The mimeType of the file
 * @property {string} fileSize - The size of the file
 */

/**
 * Represents a document with specific properties.
 * @typedef {Object} Document
 * @property {string} documentId - The unique identifier of the document.
 * @property {string} status - The status of the document (e.g. PENDING, APPROVED, REJECTED).
 * @property {string} mimeType - The MIME type of the document.
 * @property {number} fileSize - The size of the document in bytes.
 * @property {string} uploadUrl - The URL for uploading the document.
 * @property {Array} errors - Any errors associated with the document.
 */

/**
 * Response object for initiating a document upload.
 *
 * @typedef {Object} DocumentUploadResponse
 * @property {Array<Document>} documents - Array of uploaded documents
 * @property {string} verificationId - ID for the verification
 * @property {string} currentStep - The current step of the verification process
 * @property {Array<string>} errorIds - Array of error IDs
 * @property {string} segment - The segment of the verification
 * @property {string} subSegment - The sub-segment of the verification
 * @property {string} locale - The locale
 * @property {string} country - The country
 * @property {number} created - Timestamp of creation
 * @property {number} updated - Timestamp of last update
 * @property {string} submissionUrl - URL for submission
 * @property {Array<string>} rejectionReasons - Array of rejection reasons
 * @property {string} maxReviewTime - Maximum review time
 * @property {string} estimatedReviewTime - Estimated review time
 */

/**
 * @class SheerIDDocUploadHandler
 * @extends SheerIDVerificationHandler
 * @classdesc Handles document upload
 */
class SheerIDDocUploadHandler extends SheerIDVerificationHandler {
  /**
   * Initiates document upload process.
   *
   * @param {string} verificationId - the ID of the verification
   * @param {Array<SheerIDFile>} documents - the documents to be uploaded
   * @return {Promise<DocumentUploadResponse>} the response data
   */
  async initiateDocUpload(verificationId, documents) {
    try {
      const response = await this.request.post(
        `/verification/${verificationId}/step/docUpload`,
        documents,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error(`Error initiating document upload`, error.response.data);
      throw new ApiError(
        httpStatus.FAILED_DEPENDENCY,
        "Failed to initiate document upload"
      );
    }
  }

  /**
   * Complete document upload process.
   *
   * @param {string} submissionUrl - The submission URL from the initiateDocUpload response
   * @returns The data from the response
   */
  async completeDocUpload(submissionUrl) {
    try {
      const response = await this.request.post(submissionUrl);
      return response.data;
    } catch (error) {
      logger.error(`Error completing document upload`, error.response.data);
      throw new ApiError(
        httpStatus.FAILED_DEPENDENCY,
        "Failed to complete document upload"
      );
    }
  }

  /**
   * Uploads a single document. To be used after initiateDocUpload
   *
   * @param {string} uploadUrl - The URL to use for uploading the document
   * @param {Object} file - The data to be uploaded
   * @return {Promise<number>} The HTTP status code from the document upload
   */
  async docUpload(uploadUrl, file) {
    try {
      const options = {
        headers: {
          "Content-Type": file.mimetype,
          "Content-Length": file.size,
          // we don't want to send the Authorization header to the S3 endpoint
          Authorization: undefined,
        },
      };

      const response = await this.request.put(uploadUrl, file, options);
      if (response.status !== httpStatus.OK) {
        throw new ApiError(
          httpStatus.FAILED_DEPENDENCY,
          "Failed to upload a document"
        );
      }
      return response.status;
    } catch (error) {
      logger.error(`Error uploading document`, error.response.data);
      throw new ApiError(
        httpStatus.FAILED_DEPENDENCY,
        "Failed to upload a document"
      );
    }
  }
}

export default SheerIDDocUploadHandler;
