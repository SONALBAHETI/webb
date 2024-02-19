import Joi from "joi";

// Define schemas for nested structures
const degreeSchema = Joi.object({
  name: Joi.string().required(),
  institution: Joi.string().required(),
  year: Joi.number().required(),
});

const certificateSchema = Joi.object({
  name: Joi.string().required(),
  dateOfIssue: Joi.date().required(),
  expirationDate: Joi.date().required(),
});

const educationSchema = Joi.object({
  degrees: Joi.array().items(degreeSchema).default([]),
  certificates: Joi.array().items(certificateSchema).default([]),
  isResidencyTrained: Joi.boolean().optional(),
  isFellowshipTrained: Joi.boolean().optional(),
  residencyPrograms: Joi.array().items(Joi.string().lowercase()).default([]),
  fellowshipPrograms: Joi.array().items(Joi.string().lowercase()).default([]),
});

const expertiseSchema = Joi.object({
  yearsInClinicalPractice: Joi.number().required(),
  commonlyTreatedDiagnoses: Joi.array()
    .items(Joi.string().lowercase())
    .default([]),
  boardSpecialties: Joi.array().items(Joi.string().lowercase()).default([]),
  expertiseAreas: Joi.array().items(Joi.string().lowercase()).default([]),
  primaryInterests: Joi.array().items(Joi.string().lowercase()).default([]),
  practiceAreas: Joi.array().items(Joi.string().lowercase()).default([]),
});

/**
 * Schema for submitting profile form
 */
const submitProfileForm = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    picture: Joi.string().optional(),
    bio: Joi.string().optional(),
    primaryRole: Joi.string().optional(),
    pronouns: Joi.string().required(),
    gender: Joi.string().required(),
    identity: Joi.string().optional(),
    ethnicity: Joi.string().optional(),
    personalInterests: Joi.array().items(Joi.string().lowercase()).default([]),
    religiousAffiliations: Joi.array()
      .items(Joi.string().lowercase())
      .default([]),
    education: educationSchema,
    expertise: expertiseSchema,
  }),
};

export default { submitProfileForm };
