import config from "../config/config.js";
import SheerIDOrganizationsHandler from "../providers/sheerID/modules/organizations.js";
import SheerIDStudentVerificationHandler from "../providers/sheerID/modules/studentVerification.js";

const organizationsHandler = new SheerIDOrganizationsHandler(
  config.sheerId.accessToken,
  config.sheerId.studentVerificationProgramId
);
const verificationHandler = new SheerIDStudentVerificationHandler(
  config.sheerId.accessToken,
  config.sheerId.studentVerificationProgramId
);

/**
 * Submits verification data and returns the response.
 *
 * @param {SubmitDataAgainstProgramParams} data - the verification data to be submitted
 * @return the response from the verification handler
 */
const submitVerificationData = async (data) => {
  const response = await verificationHandler.submitDataAgainstProgram(data);
  return response;
};

/**
 * Retrieves the verification status for the given verification ID.
 *
 * @param {string} verificationId - The ID of the verification
 * @returns {Promise<import("../providers/sheerID/modules/studentVerification.js").StudentVerificationResponse>} The verification status
 */
const getVerificationStatus = async (verificationId) => {
  const verificationStatus = await verificationHandler.getVerificationStatus(
    verificationId
  );
  return verificationStatus;
};

/**
 * Retrieves the organization search URL asynchronously.
 *
 * @return {Promise<string>} The organization search URL.
 */
const getOrgSearchUrl = async () => {
  const orgSearchUrl = await organizationsHandler.getOrgSearchUrl();
  return orgSearchUrl;
};

/**
 * Retrieves organizations based on the provided search URL and search term.
 *
 * @param {string} orgSearchUrl - The URL for searching organizations.
 * @param {string} searchTerm - The term to search for within organizations.
 * @return The array of organizations matching the search term.
 */
const getOrganizations = async (orgSearchUrl, searchTerm) => {
  const organizations = await organizationsHandler.searchOrganizations(
    orgSearchUrl,
    searchTerm
  );
  return organizations;
};

export default {
  getOrganizations,
  getOrgSearchUrl,
  getVerificationStatus,
  submitVerificationData,
}

/**
 * @typedef {import("../providers/sheerID/modules/studentVerification.js").SubmitDataAgainstProgramParams} SubmitDataAgainstProgramParams
 */


