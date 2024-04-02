import logger from "../config/logger.js";

// utility function to catch async errors
const webhookHandler = (fn) => (req, res) => {
  Promise.resolve(fn(req, res)).catch((err) =>
    logger.error("❌ ~ webhookHandler ~ err", err)
  );
};

export default webhookHandler;
