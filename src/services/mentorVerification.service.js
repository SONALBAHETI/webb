import config from "../config/config.js";
import SheerIDHealthcareProfessionalVerificationHandler from "../providers/sheerID/modules/healthcareProfessionalVerification.js";
import SheerIDOrganizationsHandler from "../providers/sheerID/modules/organizations.js";

/**
 * @typedef {import("../providers/sheerID/modules/healthcareProfessionalVerification.js").SubmitDataAgainstProgramParams} SubmitDataAgainstProgramParams
 */

const verificationHandler =
  new SheerIDHealthcareProfessionalVerificationHandler(
    config.sheerId.accessToken,
    config.sheerId.mentorVerificationProgramId
  );
const organizationsHandler = new SheerIDOrganizationsHandler(
  config.sheerId.accessToken,
  config.sheerId.mentorVerificationProgramId
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
 * @return The verification status
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
  submitVerificationData,
  getVerificationStatus,
};
