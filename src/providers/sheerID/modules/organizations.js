import logger from "../../../config/logger.js";
import SheerIDAPIHandler from "../api.js";
import { getErrorMessage } from "../common/errors.js";
import SheerIDThemeHandler from "./theme.js";

class SheerIDOrganizationsHandler extends SheerIDAPIHandler {
  constructor(accessToken, programId) {
    super(accessToken);
    this.programId = programId;
    this.themeHandler = new SheerIDThemeHandler(accessToken, programId);
  }

  /**
   * Retrieves the organization search URL.
   *
   * @return {Promise<string>} the organization search URL
   */
  async getOrgSearchUrl() {
    try {
      const theme = await this.themeHandler.getTheme();
      return theme.config.orgSearchUrl;
    } catch (error) {
      const message = getErrorMessage(error.response?.data);
      logger.error(`Error getting org search url: ${message}`);
      throw error;
    }
  }

  /**
   * Searches organizations.
   *
   * @param {string} orgSearchUrl - The URL for organization search.
   * @param {string} searchTerm - The term to search for.
   * @return {Promise} The data from the organization search response.
   */
  async searchOrganizations(orgSearchUrl, searchTerm) {
    try {
      if (!orgSearchUrl) {
        throw new Error("No organization search URL provided");
      }
      if (!searchTerm) {
        return [];
      }
      const response = await this.request.get(`${orgSearchUrl}${searchTerm}`);
      return response.data;
    } catch (error) {
      logger.error(`Error searching organizations: ${error.response?.data}`);
      throw error;
    }
  }
}

export default SheerIDOrganizationsHandler;
