import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import config from "../config/config.js";
import logger from "../config/logger.js";
import path from "path";

const transport = nodemailer.createTransport(config.email.smtp);

// point to the email templates folder
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./src/emails/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./src/emails/"),
};

// use a template file with nodemailer
transport.use("compile", hbs(handlebarOptions));

if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

/**
 * Send an email using a handlebars email template
 * @param {string} to - recipient
 * @param {string} subject - email subject
 * @param {string} template - name of the email template
 * @param {Object} context - email template context
 * @returns {Promise}
 */
const sendEmail = async (to, subject, template, context) => {
  const mailOptions = {
    from: config.email.from,
    to,
    subject,
    template,
    context,
  };
  await transport.sendMail(mailOptions);
};

/**
 * Sends a verification email.
 *
 * @param {Object} options - The options object.
 * @param {string} options.to - The email address to send the verification email to.
 * @param {string} options.token - The verification token.
 * @param {string} [options.redirect] - The redirect url.
 * @param {Object} [options.context] - The context to be passed to the email template.
 */
const sendVerificationEmail = async ({ to, token, redirect, context = {} }) => {
  const subject = "Verify your email";
  // link to the email verification page of the front-end app
  let verificationLink = `${config.frontendBaseUrl}/verification/email?token=${token}`;
  if (redirect) {
    verificationLink += `&redirect=${redirect}`;
  }
  // send email with verification link
  await sendEmail(to, subject, "emailVerificationEmail", {
    verificationLink,
    ...context,
  });
};

/**
 * Sends a reset password verification email.
 *
 * @param {Object} options - The options object.
 * @param {string} options.to - The email address to send the verification email to.
 * @param {string} options.token - The verification token.
 * @param {string} [options.redirect] - The redirect url.
 * @param {Object} [options.context] - The context to be passed to the email template.
 */
const sendResetPasswordVerificationEmail = async ({
  to,
  token,
  redirect,
  context = {},
}) => {
  const subject = "Reset your password";
  // link to the reset password page of the front-end app
  let resetPasswordVerificationLink = `${config.frontendBaseUrl}/verification/reset-password?token=${token}`;
  if (redirect) {
    resetPasswordVerificationLink += `&redirect=${redirect}`;
  }
  await sendEmail(to, subject, "resetPasswordVerificationEmail", {
    resetLink: resetPasswordVerificationLink,
    ...context,
  });
};

export default {
  transport,
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordVerificationEmail,
};
