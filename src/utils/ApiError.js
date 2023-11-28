class ApiError extends Error {
  /**
   * Constructor function for creating an instance of the class.
   *
   * @param {number} statusCode - The status code of the instance.
   * @param {string} message - The message of the instance.
   * @param {boolean} [isOperational=true] - The operational status of the instance. Defaults to true.
   * @param {string} [stack=''] - The stack trace of the instance. Defaults to an empty string.
   */
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
