import Joi from "joi";

/**
 * Schema for submitting profile form
 */
const submitProfileForm = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    pronouns: Joi.string().required(),
    gender: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    bio: Joi.string().required(),
    identity: Joi.string().optional(),
    ethnicity: Joi.string().optional(),
    personalInterests: Joi.array().items(Joi.string()).default([]),
    areasOfExpertise: Joi.array().items(Joi.string()).default([]),
    targetedDiagnoses: Joi.array().items(Joi.string()).default([]),
    areasOfPractice: Joi.array().items(Joi.string()).default([]),
    boardSpecialties: Joi.array().items(Joi.string()).default([]),
    yearsOfExperience: Joi.number().required(),
    degrees: Joi.array().items(Joi.string()).default([])
  }),
};

export default { submitProfileForm };
