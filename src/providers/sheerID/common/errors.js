const errorMessages = new Map([["invalidBirthDate", "Birth date is invalid"]]);

export const getErrorMessage = (errorResponse) => {
  if (!errorResponse) return "";
  const { errorIds } = errorResponse;
  if (errorIds && Array.isArray(errorIds)) {
    return errorMessages.get(errorIds[0]);
  } else {
    return "";
  }
};
