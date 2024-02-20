import logger from "../../../config/logger.js";
import SheerIDAPIHandler from "../api.js";

/**
 * @typedef {"student" | "teacher" | "military" | "senior" | "age" | "firstResponder" | "medical" | "employment" | "marketplace" | "member" | "licensedProfessional" | "recentMover" | "other"} Segment
 * @typedef {"activeDuty" | "veteran" | "retiree" | "reservist" | "militaryFamily" | "goldStarFamily" | "police" | "fireFighter" | "searchAndRescue" | "emt" | "employee" | "homeBuyer" | "otherMover" | "facultyHighSchool" | "facultyUniversity" | "facultyPostSecondary" | "facultyK12" | "fullAndPartTimeUniversity" | "collegeBound" | "highSchool" | "postSecondary" | "nurse" | "doctor" | "otherHealthWorker" | "dentist" | "pharmacist" | "generalContractor" | "snapBenefits" | "otherGovernmentAssistance" | "architect" | "interiorDesigner" | "librarian" | "childCareWorker" | "veterinarian" | "licensedRealEstateAgent" | "licensedCosmetologist"} SubSegment
 */

class SheerIDVerificationHandler extends SheerIDAPIHandler {
  
  /**
   * Async function to get verification status.
   *
   * @param {string} verificationId - The ID of the verification
   * @return The data returned from the verification status request
   */
  async getVerificationStatus(verificationId) {
    try {
      const response = await this.request.get(
        `/verification/${verificationId}`
      );
      return response.data;
    } catch (error) {
      logger.error(
        `Error fetching verification status: ${error.response.data}`
      );
      throw error;
    }
  }

  /**
   * @typedef {Object} DocUploadResponse
   * @property {string} verificationId - The unique identifier for the ongoing verification
   * @property {string} currentStep - The current step of the verification process
   * @property {string} submissionUrl - The URL to use for submitting person data
   * @property {Array<import("./healthcareProfessionalVerification.js").Status>} availableStatuses - The list of statuses that are available for selection by the program
   * @property {Array<ErrorId>} [errorIds] - The list of errors that occurred, if any
   * @property {Segment} [segment] - The market segment being verified
   * @property {SubSegment} [subsegment] - The subsegment being verified
   * @property {string} [locale] - The locale chosen by the user
   * @property {string} [country] - The country code of the person being verified
   */

  /**
   * Uploads a document for a specific verification process step.
   *
   * @param {string} uploadUrl - The URL to use for uploading the document
   * @param {FormData} formData - The data to be uploaded
   * @return {Promise<DocUploadResponse>} The response data from the document upload
   */
  async docUpload(uploadUrl, formData) {
    try {
      const response = await this.request.put(uploadUrl, formData, {
        headers: formData.getHeaders(),
      });
      return response.data;
    } catch (error) {
      logger.error(`Error uploading document: ${error.response.data}`);
      throw error;
    }
  }

  /**
   * Cancel document upload for a verification (will move the verification to the next step)
   *
   * @param {string} verificationId - The ID of the verification process
   * @return {Promise<DocUploadResponse>} The response data from the document upload cancellation
   */
  async cancelDocUpload(verificationId) {
    try {
      const response = await this.request.delete(
        `/verification/${verificationId}/step/docUpload`
      );
      return response.data;
    } catch (error) {
      logger.error(`Error cancelling document upload: ${error.response.data}`);
      throw error;
    }
  }
}

export default SheerIDVerificationHandler;
