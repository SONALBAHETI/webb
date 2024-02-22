import mongoose from "mongoose";
import mongodb from "mongodb";

/**
 * PaginationOptions
 * @typedef {import("./models/plugins/paginate.plugin.js").PaginationOptions} PaginationOptions
 * PaginationResult
 * @typedef {import("./models/plugins/paginate.plugin.js").PaginationResult} PaginationResult
 * FlattenMapsResult
 * @typedef {mongoose.FlattenMaps<mongoose.Document<any, any, any>> & { _id: mongoose.Types.ObjectId; }} FlattenMapsResult
 * BulkWriteResult
 * @typedef {mongodb.BulkWriteResult} BulkWriteResult
 * Suggestion types
 * @typedef {"primaryInterest" | "expertiseArea" | "practiceArea" | "personalInterest" | "religiousAffiliation"} SuggestionType
 */

export default {};
