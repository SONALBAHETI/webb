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
  .post(
    auth(),
    validate(accountSettingsValidation.createQuickReply),
    responseHandler(accountSettingsController.createQuickReply)
  );

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

// get or update notification settings
router
  .route("/notifications")
  .get(
    auth(),
    responseHandler(accountSettingsController.getNotificationSettings)
  )
  .patch(
    auth(),
    validate(accountSettingsValidation.updateNotificationSettings),
    responseHandler(accountSettingsController.updateNotificationSettings)
  );

// account deactivation and deletion
router.delete(
  "/deactivate",
  auth(),
  responseHandler(accountSettingsController.deactivateAccount)
);
router.delete(
  "/delete",
  auth(),
  responseHandler(accountSettingsController.scheduleAccountDeletion)
);

// google calendar sync
router.post(
  "/calendar-sync/google/auth",
  auth(),
  validate(accountSettingsValidation.authorizeGoogleCalendarSync),
  responseHandler(accountSettingsController.authorizeGoogleCalendarSync)
);

// verify google calendar sync
router.get(
  "/calendar-sync/google/verify",
  auth(),
  responseHandler(accountSettingsController.verifyGoogleCalendarSync)
)

// remove google calendar sync
router.delete(
  "/calendar-sync/google",
  auth(),
  responseHandler(accountSettingsController.removeGoogleCalendarSync)
)

export default router;
