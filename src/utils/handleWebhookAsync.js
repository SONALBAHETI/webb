import httpStatus from "http-status";
import processAsync from "./processAsync.js";

/**
 * Handle a webhook asynchronously.
 * @param {function} fn - the function to process the request
 * @return {function} the middleware function that will call fn, then send a 200 response
 */
const handleWebhookAsync = (fn) => (req, res) => {
  processAsync(() => fn(req));
  res.sendStatus(httpStatus.OK);
};

export default handleWebhookAsync;
