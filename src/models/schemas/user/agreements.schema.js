import mongoose from "mongoose";
import toJSON from "../../plugins/toJSON.plugin.js";

/**
 * @typedef {Object} AgreementsSchema
 * @property {boolean} [shareExtraDetailsForMatchmaking] - Whether to share extra details for matchmaking
 */
const agreementsSchema = new mongoose.Schema({
  shareExtraDetailsForMatchmaking: Boolean,
});

agreementsSchema.plugin(toJSON);

export default agreementsSchema;
