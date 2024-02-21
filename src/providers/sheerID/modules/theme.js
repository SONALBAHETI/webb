import logger from "../../../config/logger.js";
import SheerIDAPIHandler from "../api.js";

class SheerIDThemeHandler extends SheerIDAPIHandler {
  constructor(accessToken, programId) {
    super(accessToken);
    this.programId = programId;
  }

  /**
   * Retrieves the organization search URL.
   *
   * @return {Promise<string>} the organization search URL
   */
  async getTheme() {
    try {
      const response = await this.request.get(
        `/program/${this.programId}/theme`
      );
      return response.data;
    } catch (error) {
      logger.error(`Error getting theme from SheerID: ${error.response?.data}`);
      throw error;
    }
  }
}

export default SheerIDThemeHandler;
