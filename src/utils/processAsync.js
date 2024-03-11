import logger from "../config/logger.js";

const processAsync = (callback, timeout) => {
  setTimeout(async () => {
    if (callback) {
      try {
        await callback();
      } catch (error) {
        logger.error("Error in processAsync", error);
      }
    }
  }, timeout || 1000);
};

export default processAsync;
