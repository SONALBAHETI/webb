import dotenv from "dotenv";
import path from "path";
import Joi from "joi";
import { getDirName } from "../utils/dirname.js";

dotenv.config({ path: path.join(getDirName(import.meta.url), "../../.env") });

// validate environment variables
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    FRONTEND_BASE_URL: Joi.string().description("Frontend base URL").required(),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    MONGODB_ADMIN_URL: Joi.string().required().description("Mongo DB url for scheduled jobs"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
    SENDBIRD_APP_ID: Joi.string().description("Sendbird App ID").required(),
    SENDBIRD_API_TOKEN: Joi.string()
      .description("Sendbird API token")
      .required(),
    OPENAI_API_KEY: Joi.string().description("OpenAI API token").required(),
    OPENAI_MENTOR_FINDER_ASSISTANT_ID: Joi.string()
      .description("OpenAI Assistant ID")
      .required(),
    GOOGLE_CLIENT_ID: Joi.string()
      .description("Google OAuth client ID")
      .required(),
    SHEER_ID_ACCESS_TOKEN: Joi.string()
      .description("Sheer ID Access Token")
      .required(),
    SHEER_ID_MENTOR_VERIFICATION_PROGRAM_ID: Joi.string()
      .description("Sheer ID Mentor Verification Program ID")
      .required(),
    CLOUDINARY_CLOUD_NAME: Joi.string()
      .description("Cloudinary Cloud Name")
      .required(),
    CLOUDINARY_API_KEY: Joi.string()
      .description("Cloudinary API Key")
      .required(),
    CLOUDINARY_API_SECRET: Joi.string()
      .description("Cloudinary API Secret")
      .required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// export env variables after validating
const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  frontendBaseUrl: envVars.FRONTEND_BASE_URL,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    adminUrl: envVars.MONGODB_ADMIN_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  sendBird: {
    appId: envVars.SENDBIRD_APP_ID,
    apiToken: envVars.SENDBIRD_API_TOKEN,
  },
  openAI: {
    apiKey: envVars.OPENAI_API_KEY,
    mentorFinderAssistantId: envVars.OPENAI_MENTOR_FINDER_ASSISTANT_ID,
  },
  providers: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
    },
  },
  sheerId: {
    accessToken: envVars.SHEER_ID_ACCESS_TOKEN,
    mentorVerificationProgramId:
      envVars.SHEER_ID_MENTOR_VERIFICATION_PROGRAM_ID,
  },
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};

export default config;
