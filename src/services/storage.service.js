import cloudinary from "../config/cloudinary.js";
import logger from "../config/logger.js";
import { bufferToDataUri } from "../utils/dataUri.js";

/**
 * Uploads a file to Cloudinary.
 *
 * @param {Object} file - the file to be uploaded
 * @param {import("cloudinary").UploadApiOptions} options - the options for uploading the file
 * @return A Promise that resolves to the uploaded file data
 */
const uploadFile = async (file, options) => {
  try {
    const dataUri = bufferToDataUri(file);
    return await cloudinary.uploader.upload(dataUri, options);
  } catch (error) {
    logger.error("Error uploading file to Cloudinary", error);
    throw error;
  }
};

export default {
  uploadFile,
};
