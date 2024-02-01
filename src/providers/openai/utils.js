/**
 * 
 * @param {string} aiResponse - The response from the OpenAI API
 * @param {boolean} throwErr - Whether to throw an error if parsing fails
 * @returns {Object} - The parsed JSON object
 */
export const aiResponseToJSON = (aiResponse, throwErr) => {
  try {
    return JSON.parse(aiResponse);
  } catch (error) {
    logger.error(`Error parsing openai response to JSON: ${error}`);
    if (throwErr) throw error;
    return null;
  }
};
