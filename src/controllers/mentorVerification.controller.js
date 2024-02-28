import httpStatus from "http-status";
import { format } from "date-fns";
import pick from "../utils/pick.js";
import mentorVerificationService from "../services/mentorVerification.service.js";

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
  const { verificationId, currentStep } =
    await mentorVerificationService.submitVerificationData(data);
  await mentorVerificationService.updateVerificationStatusOfUser({
    userId: req.user.id,
    verificationId,
    currentStep,
  });
  res.status(httpStatus.OK).send({ currentStep });
};

/**
 * Retrieves the organization search URL and sends it as a response.
 *
 * @param {import("express").Request} req - the request object
 * @param {import("express").Response} res - the response object
 * @return resolves with the organization search URL sent in the response
 */
const getOrgSearchUrl = async (req, res) => {
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
  if (currentStep !== "success" && sheerID?.verificationId) {
    try {
      const verificationStatus =
        await mentorVerificationService.getVerificationStatus(
          sheerID.verificationId
        );
      currentStep = verificationStatus.currentStep;
      await mentorVerificationService.updateVerificationStatusOfUser({
        userId: req.user.id,
        verificationId: verificationStatus.verificationId,
        currentStep,
      });
    } catch (error) {
      // TODO: handle error
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
