/**
 * Validates the given password value.
 *
 * @param {string} value - The password value to be validated.
 * @param {object} helpers - The helper functions provided by Joi.
 * @return {string | undefined} - The validated password value if it passes all validation checks, otherwise an error message.
 */
const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
};

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message("{{#label}} must be a valid id");
  }
  return value;
};

export { password, objectId };
