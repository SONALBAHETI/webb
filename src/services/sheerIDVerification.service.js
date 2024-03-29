import httpStatus from "http-status";
import config from "../config/config.js";
import SheerIDDocUploadHandler from "../providers/sheerID/modules/docUpload.js";
import ApiError from "../utils/ApiError.js";
import { updateUser } from "./user.service.js";

const docUploadHandler = new SheerIDDocUploadHandler(
  config.sheerId.accessToken
);

/**
 * Uploads documents using the docUploadHandler.
 *
 * @param {string} verificationId - The ID of the verification
 * @param {Array<import("../providers/sheerID/modules/docUpload.js").SheerIDFile>} documents - The documents to be uploaded
 * @return The response from the document upload handler
 */
const uploadDocuments = async (verificationId, files) => {
  const formattedDocs = files.map((file) => convertFileToDocUploadFormat(file));
  // initiate the document upload process
  const initiateDocUploadResponse = await docUploadHandler.initiateDocUpload(
    verificationId,
    formattedDocs
  );
  // upload each document one by one
  for (const doc of initiateDocUploadResponse.documents || []) {
    // find the file that matches the MIME type and size from the response
    const fileToUpload = files.find(
      (file) => file.mimetype === doc.mimeType && file.size === doc.fileSize
    );
    if (fileToUpload) {
      // upload file
      await docUploadHandler.docUpload(doc.uploadUrl, fileToUpload);
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong while uploading documents"
      );
    }
  }
  // complete the document upload process
  const completeDocUploadResponse = await docUploadHandler.completeDocUpload(
    initiateDocUploadResponse.submissionUrl
  );
  return completeDocUploadResponse;
};

/**
 * Convert a file to a document upload format for SheerID.
 *
 * @param {Object} file - the file to be converted
 * @return {Object} the converted file information
 */
const convertFileToDocUploadFormat = (file) => {
  return {
    fileName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
  };
};

/**
 * Updates the verification status of a user.
 *
 * @param {Object} options - The options object containing userId, verificationId, and currentStep.
 * @param {string} options.userId - The ID of the user to update.
 * @param {string} [options.sheerIdData] - The sheerID response data.
 *
 * @returns A Promise that resolves to the updated user object.
 */
const updateSheerIDVerificationDataOfUser = async ({ userId, sheerIdData }) => {
  const { verificationId, currentStep } = sheerIdData;
  return await updateUser(userId, {
    integrations: {
      sheerId: {
        verificationId,
        currentStep,
      },
    },
  });
};

export default {
  updateSheerIDVerificationDataOfUser,
  uploadDocuments,
  convertFileToDocUploadFormat,
};
