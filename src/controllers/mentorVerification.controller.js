import httpStatus from "http-status";
import { format } from "date-fns";
import pick from "../utils/pick.js";
import mentorVerificationService from "../services/mentorVerification.service.js";
import sheerIDVerificationService from "../services/sheerIDVerification.service.js";
import logger from "../config/logger.js";

/**
 * Submits verification data and updates the verification status of the user.
 *
 * @param {import("express").Request} req - the request object
 * @param {import("express").Response} res - the response object
 * @return A Promise that resolves to the current step
 */
const submitVerificationData = async (req, res) => {
  const data = pick(req.body, [
    "firstName",
    "lastName",
    "email",
    "birthDate",
    "postalCode",
    "organization",
    "status",
  ]);
  data.birthDate = format(new Date(data.birthDate), "yyyy-MM-dd");
  const sheerIdResponse =
    await mentorVerificationService.submitVerificationData(data);
  await sheerIDVerificationService.updateSheerIDVerificationDataOfUser({
    userId: req.user.id,
    sheerIdData: sheerIdResponse,
  });
  res.status(httpStatus.OK).send({ currentStep: sheerIdResponse.currentStep });
};

/**
 * Retrieves the organization search URL and sends it as a response.
 *
 * @param {import("express").Request} req - the request object
 * @param {import("express").Response} res - the response object
 * @return resolves with the organization search URL sent in the response
 */
const getOrgSearchUrl = async (_req, res) => {
  const orgSearchUrl = await mentorVerificationService.getOrgSearchUrl();
  res.status(httpStatus.OK).send({ orgSearchUrl });
};

/**
 * Function to get organizations based on search parameters.
 *
 * @param {import("express").Request} req - the request object
 * @param {import("express").Response} res - the response object
 * @return organizations based on the search parameters
 */
const getOrganizations = async (req, res) => {
  const { orgSearchUrl, searchTerm } = req.query;
  const organizations = await mentorVerificationService.getOrganizations(
    orgSearchUrl,
    searchTerm
  );
  res.status(httpStatus.OK).send({ organizations });
};

/**
 * Retrieves the current sheerID verification step and sends it as a response.
 *
 * @param {import("express").Request} req - the request object
 * @param {import("express").Response} res - the response object
 * @return The current step of the verification process
 */
const getVerificationStep = async (req, res) => {
  const sheerID = req.user.getSheerIdStatus();
  let currentStep = sheerID?.currentStep || "notStarted";
  // if the current step is not "success", check the verification status
  if (currentStep !== "success" && sheerID?.verificationId) {
    try {
      // retrieve verification status from sheerID
      const verificationStatus =
        await mentorVerificationService.getVerificationStatus(
          sheerID.verificationId
        );

      // update the latest status on user document
      await sheerIDVerificationService.updateSheerIDVerificationDataOfUser({
        userId: req.user.id,
        sheerIdData: verificationStatus,
      });
      return res
        .status(httpStatus.OK)
        .send(
          pick(verificationStatus, [
            "currentStep",
            "maxReviewTime",
            "estimatedReviewTime",
            "rejectionReasons",
          ])
        );
    } catch (error) {
      logger.error(error);
    }
  }
  res.status(httpStatus.OK).send({ currentStep });
};

export {
  submitVerificationData,
  getOrgSearchUrl,
  getOrganizations,
  getVerificationStep,
};
