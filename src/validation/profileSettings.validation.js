import Joi from "joi";

const getSuggestions = {
  query: Joi.object().keys({
    q: Joi.string().required(),
  }),
};

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

const educationForm = {
  body: Joi.object().keys({
    isResidencyTrained: Joi.boolean().optional(),
    isFellowshipTrained: Joi.boolean().optional(),
    residencyPrograms: Joi.when("isResidencyTrained", {
      is: true,
      then: Joi.array().items(Joi.string()).min(1),
      otherwise: Joi.array().items(Joi.string()).default([]),
    }),
    fellowshipPrograms: Joi.when("isFellowshipTrained", {
      is: true,
      then: Joi.array().items(Joi.string()).min(1),
      otherwise: Joi.array().items(Joi.string()).default([]),
    }),
  }),
};

const expertiseForm = Joi.object({
  yearsInClinicalPractice: Joi.number().min(0).required(),
  commonlyTreatedDiagnoses: Joi.array()
    .items(Joi.string())
    .min(1)
    .max(7)
    .default([]),
  boardSpecialties: Joi.array().items(Joi.string()).min(1).max(7).default([]),
  expertiseAreas: Joi.array().items(Joi.string()).min(1).max(7).default([]),
  primaryInterests: Joi.array().items(Joi.string()).min(1).max(7).default([]),
  practiceAreas: Joi.array().items(Joi.string()).min(1).max(7).default([]),
});

const uploadProfilePicture = {
  image: Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/jpg")
      .required(),
    size: Joi.number().max(200000).required(),
    path: Joi.string().required(),
  }).required(),
};

export default {
  submitIdentityInfo,
  getSuggestions,
  addNewDegree,
  addNewCertificate,
  educationForm,
  expertiseForm,
  uploadProfilePicture,
};
