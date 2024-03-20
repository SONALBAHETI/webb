import express from "express";
import auth from "../../middlewares/auth.js";
import accountSettingsController from "../../controllers/accountSettings.controller.js";
import responseHandler from "../../utils/responseHandler.js";
import validate from "../../middlewares/validate.js";
import accountSettingsValidation from "../../validation/accountSettings.validation.js";

const router = express.Router();

// retrieve all quick replies or create new quick reply
router
  .route("/quick-replies")
  .get(auth(), responseHandler(accountSettingsController.getQuickReplies))
  .post(auth(), validate(accountSettingsValidation.createQuickReply), responseHandler(accountSettingsController.createQuickReply));

// get, update or delete a quick reply
router
  .route("/quick-replies/:quickReplyId")
  .get(
    auth(),
    validate(accountSettingsValidation.quickReplyById),
    responseHandler(accountSettingsController.getQuickReplyById)
  )
  .patch(
    auth(),
    validate(accountSettingsValidation.updateQuickReply),
    responseHandler(accountSettingsController.updateQuickReply)
  )
  .delete(
    auth(),
    validate(accountSettingsValidation.quickReplyById),
    responseHandler(accountSettingsController.deleteQuickReply)
  );

export default router;
