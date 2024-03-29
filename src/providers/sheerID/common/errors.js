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

/**
 * @typedef {"internalServerError" | "noProgram" | "invalidProgram" | "expiredProgram" | "inactiveProgram" | "expiredVerification" | "noVerification" | "noOrganization" | "invalidRequest" | "verificationLimitExceeded" | "apiRateLimitExceeded" | "docReviewLimitExceeded" | "noRemainingRewardCodes" | "unknownError" | "invalidApiToken" | "simulatedError" | "invalidDocUploadToken" | "notFound" | "unauthorizedAccountStatus" | "unauthorizedDomain" | "unauthorizedIpAddress" | "unauthorizedRequest" | "unauthorizedUser" | "reverificationDailyLimitExceeded" | "invalidVerificationToken" | "expiredVerificationToken" | "notApproved" | "maxSMSCodeLimitExceeded" | "fraudRulesReject" | "invalidStep" | "invalidOrganization" | "invalidFirstName" | "invalidLastName" | "invalidEmail" | "invalidPhoneNumber" | "invalidBirthDate" | "invalidAddress1" | "invalidCity" | "invalidState" | "invalidPostalCode" | "invalidMilitaryStatus" | "invalidFirstResponderStatus" | "invalidMedicalProfessionalStatus" | "invalidSocialSecurityNumber" | "invalidOverrideCode" | "underagePerson" | "outsideAgePerson" | "futureBirthDate" | "invalidDischargeDate" | "dischargeDateBeforeBirthDate" | "unsupportedDocMimeType" | "invalidFileSizeMax" | "invalidFileSizeEmpty" | "invalidNumberOfFiles" | "maxMetadataValuesExceeded" | "maxMetadataLengthExceeded" | "invalidSMSCode" | "expiredSMSCode" | "incorrectSMSCodeAttemptLimitExceeded" | "incorrectVerificationOverrideCodeAttemptLimitExceeded" | "invalidEmailLoopToken" | "expiredEmailLoopToken"} ErrorId
 */
