import express from "express";
import auth from "../../middlewares/auth.js";
import responseHandler from "../../utils/responseHandler.js";
import validate from "../../middlewares/validate.js";
import appointmentController from "../../controllers/appointment.controller.js";
import appointmentValidation from "../../validation/appointment.validation.js";
import { Permission } from "../../config/permissions.js";

const router = express.Router();

router.get(
  "/:id",
  auth(Permission.ReadAppointments),
  validate(appointmentValidation.getAppointment),
  responseHandler(appointmentController.getAppointment)
);

export default router;
