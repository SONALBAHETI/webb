import httpStatus from "http-status";
import appointmentService from "../services/appointment.service.js";
import ApiError from "../utils/ApiError.js";

/**
 * GET Appointment by appointment Id
 * @param {import("express").Request} req  - The request object
 * @param {import("express").Response} res - The response object
 */
const getAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await appointmentService
    .getAppointmentByIdAndUserId(id, req.user.id)
    .populate([
      { path: "scheduledBy", select: "_id name" },
      { path: "scheduledWith", select: "_id name" },
    ]);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }
  res.status(httpStatus.OK).send({ appointment });
};

export default {
  getAppointment,
};
