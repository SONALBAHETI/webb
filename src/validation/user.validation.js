import Joi from "joi";
import { objectId } from "./custom.validation.js";

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateVisibility = {
  body: Joi.object().keys({
    online: Joi.boolean().required(),
  }),
};

const dayScheduleValidation = Joi.object().keys({
  enabled: Joi.boolean().required(),
  slots: Joi.array().items(
    Joi.object().keys({
      from: Joi.string()
        .regex(/(0[0-9]|1[0-2]):[0-5][0-9]( )(AM|PM)/)
        .required(),
      to: Joi.string()
        .regex(/(0[0-9]|1[0-2]):[0-5][0-9]( )(AM|PM)/)
        .required(),
    })
  ),
});

const updateAvailability = {
  body: Joi.object().keys({
    weeklyTimeSlots: Joi.object({
      monday: dayScheduleValidation,
      tuesday: dayScheduleValidation,
      wednesday: dayScheduleValidation,
      thursday: dayScheduleValidation,
      friday: dayScheduleValidation,
      saturday: dayScheduleValidation,
      sunday: dayScheduleValidation,
    }).required(),
    timeGap: Joi.object({
      active: Joi.boolean().required(),
      gap: Joi.number().optional(),
    }),
    hourlyRate: Joi.number().required(),
  }),
};

export default {
  getUser,
  updateVisibility,
  updateAvailability,
};
