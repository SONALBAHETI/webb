import Joi from "joi";
import { UserOccupations, UserObjectives } from "../constants/onboarding.js";

/**
 * Schema for getting suggestions
 */
const getSuggestions = {
  query: Joi.object().keys({
    q: Joi.string().required(),
  }),
};

/**
 * Optional suggestions schema
 */
const JoiSuggestionsOptional = () =>
  Joi.array().items(Joi.string()).default([]);

/**
 * Required suggestions schema
 */
const JoiSuggestionsRequired = () =>
  Joi.array().items(Joi.string()).min(1).max(7).required();

/**
 * Schema for submitting onboarding form
 */
const submitOnboardingForm = {
  body: Joi.object().keys({
    userOccupation: Joi.string().required(),
    userObjective: Joi.string()
      .required()
      .when("userOccupation", {
        is: UserOccupations.HEALTHCARE_STUDENT,
        // Allow empty string if user is a healthcare student
        then: Joi.string().allow(""),
      }),
    primaryAreasOfInterest: JoiSuggestionsOptional()
      .when("userOccupation", {
        is: UserOccupations.HEALTHCARE_PROFESSIONAL,
        then: Joi.when("userObjective", {
          is: UserObjectives.FIND_A_MENTOR,
          // primaryAreasOfInterest required if user is a healthcare professional looking to find a mentor
          then: JoiSuggestionsRequired(),
        }),
      })
      .when("userOccupation", {
        is: UserOccupations.HEALTHCARE_STUDENT,
        // primaryAreasOfInterest required if user is a healthcare student
        then: JoiSuggestionsRequired(),
      }),
    primaryAreasOfPractice: JoiSuggestionsOptional().when("userOccupation", {
      is: UserOccupations.HEALTHCARE_PROFESSIONAL,
      then: Joi.when("userObjective", {
        is: UserObjectives.MENTOR_OTHERS,
        // primaryAreasOfPractice required if user is a healthcare professional mentoring others
        then: JoiSuggestionsRequired(),
      }),
    }),
    areasOfExpertise: JoiSuggestionsOptional().when("userOccupation", {
      is: UserOccupations.HEALTHCARE_PROFESSIONAL,
      then: Joi.when("userObjective", {
        is: UserObjectives.MENTOR_OTHERS,
        // areasOfExpertise required if user is a healthcare professional mentoring others
        then: JoiSuggestionsRequired(),
      }),
    }),
  }),
};

export default {
  getSuggestions,
  submitOnboardingForm,
};
