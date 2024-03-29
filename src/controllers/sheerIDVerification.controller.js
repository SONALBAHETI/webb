import httpStatus from "http-status";
import sheerIDVerificationService from "../services/sheerIDVerification.service.js";

/**
 * Uploads documents and sends the response.
 *
 * @param {import("express").Request} req - the request object
 * @param {import("express").Response} res - the response object
 * @return the response of the document upload
 */
const uploadDocuments = async (req, res) => {
  const sheerID = req.user.getSheerIdStatus();
  const verificationId = sheerID?.verificationId;
  if (!verificationId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "SheerID verification not found"
    );
  }
  const response = await sheerIDVerificationService.uploadDocuments(
    verificationId,
    [req.file]
  );
  await sheerIDVerificationService.updateSheerIDVerificationDataOfUser({
    userId: req.user.id,
    sheerIdData: response,
  });
  res.status(httpStatus.OK).send({ currentStep: response.currentStep });
};

export default {
  uploadDocuments,
};
