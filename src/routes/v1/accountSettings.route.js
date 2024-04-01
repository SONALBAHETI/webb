import express from "express";
import auth from "../../middlewares/auth.js";
import accountSettingsController from "../../controllers/accountSettings.controller.js";
import responseHandler from "../../utils/responseHandler.js";
import validate from "../../middlewares/validate.js";
import accountSettingsValidation from "../../validation/accountSettings.validation.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

// retrieve all quick replies or create new quick reply
router
  .route("/quick-replies")
  .get(
    auth(Permission.ReadQuickReplies),
    responseHandler(accountSettingsController.getQuickReplies)
  )
  .post(
    auth(Permission.CreateQuickReplies),
    validate(accountSettingsValidation.createQuickReply),
    responseHandler(accountSettingsController.createQuickReply)
  );

// get, update or delete a quick reply
router
  .route("/quick-replies/:quickReplyId")
  .get(
    auth(Permission.ReadQuickReplies),
    validate(accountSettingsValidation.quickReplyById),
    responseHandler(accountSettingsController.getQuickReplyById)
  )
  .patch(
    auth(Permission.UpdateQuickReplies),
    validate(accountSettingsValidation.updateQuickReply),
    responseHandler(accountSettingsController.updateQuickReply)
  )
  .delete(
    auth(Permission.DeleteQuickReplies),
    validate(accountSettingsValidation.quickReplyById),
    responseHandler(accountSettingsController.deleteQuickReply)
  );

// get or update notification settings
router
  .route("/notifications")
  .get(
    auth(Permission.ReadNotificationSettings),
    responseHandler(accountSettingsController.getNotificationSettings)
  )
  .patch(
    auth(Permission.UpdateNotificationSettings),
    validate(accountSettingsValidation.updateNotificationSettings),
    responseHandler(accountSettingsController.updateNotificationSettings)
  );

// account deactivation and deletion
router.delete(
  "/deactivate",
  auth(Permission.DeactivateAccount),
  responseHandler(accountSettingsController.deactivateAccount)
);
router.delete(
  "/delete",
  auth(Permission.DeleteAccount),
  responseHandler(accountSettingsController.scheduleAccountDeletion)
);

// google calendar sync
router.post(
  "/calendar-sync/google/auth",
  auth(Permission.SyncGoogleCalendar),
  validate(accountSettingsValidation.authorizeGoogleCalendarSync),
  responseHandler(accountSettingsController.authorizeGoogleCalendarSync)
);

// verify google calendar sync
router.get(
  "/calendar-sync/google/verify",
  auth(Permission.SyncGoogleCalendar),
  responseHandler(accountSettingsController.verifyGoogleCalendarSync)
);

// remove google calendar sync
router.delete(
  "/calendar-sync/google",
  auth(Permission.SyncGoogleCalendar),
  responseHandler(accountSettingsController.removeGoogleCalendarSync)
);

export default router;
