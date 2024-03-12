export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validates that an array of strings is provided and all elements of the array are of type string.
 * @param {Array} arr - The array of strings to validate.
 * @param {string} paramName - The name of the parameter being validated.
 * @throws {ValidationError} Throws validation error if the array is not an array or if any element is not a string.
 */
export const validateArrayOfStrings = (arr, paramName) => {
  if (!Array.isArray(arr)) {
    throw new ValidationError(`${paramName} must be an array.`);
  }
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== "string") {
      throw new ValidationError(
        `Element at index ${i} of ${paramName} must be a string.`
      );
    }
  }
};

