import Joi from "joi";

const getSuggestions = {
  query: Joi.object().keys({
    q: Joi.string().required(),
  }),
};

// Define schemas for nested structures
const degreeSchema = Joi.object({
  name: Joi.string().required(),
  institution: Joi.string().required(),
  dateOfCompletion: Joi.date().required(),
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
const submitIdentityInfo = {
  body: Joi.object().keys({
    // picture: Joi.string().optional(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    pronouns: Joi.string().required(),
    gender: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    bio: Joi.string().required(),
    funFact: Joi.string().optional().allow(""),
    personalInterests: Joi.array().items(Joi.string()).default([]),
    identity: Joi.string().optional().allow(""),
    ethnicity: Joi.string().optional().allow(""),
    religiousAffiliations: Joi.array().items(Joi.string()).default([]),
  }),
};

const addNewDegree = {
  body: Joi.object().keys({
    degreeName: Joi.string().required(),
    universityName: Joi.string().required(),
    dateOfCompletion: Joi.date().required(),
  }),
};

const addNewCertificate = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    dateOfIssue: Joi.date().required(),
    expirationDate: Joi.date().required(),
  }),
};

export default { submitIdentityInfo, getSuggestions, addNewDegree, addNewCertificate };
