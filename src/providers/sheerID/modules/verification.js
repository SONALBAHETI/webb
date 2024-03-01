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
}

export default SheerIDVerificationHandler;
