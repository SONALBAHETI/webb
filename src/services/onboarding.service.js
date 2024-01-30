import PrimaryInterest from "../models/primaryInterest.model.js";

/**
 * Query primary interests from database
 * @param {Object} query - Mongo query
 * @param {import("../types.js").PaginationOptions} options - pagination options
 * @returns {Promise<import("../types.js").PaginationResult>}
 */
const queryPrimaryInterests = async (query, options) => {
  const result = await PrimaryInterest.paginate(query, options);
  return result;
};

/**
 * Upserts multiple primary interests into the database.
 *
 * @param {Array<String>} interests - The array of primary interests to upsert.
 * @return A promise that resolves to the result of the bulk write operation.
 */
const bulkUpsertPrimaryInterests = async (interests) => {
  const bulkOps = interests.map((interest) => {
    return {
      updateOne: {
        filter: { title: interest },
        update: { $setOnInsert: { title: interest } },
        upsert: true,
      },
    };
  });
  return await PrimaryInterest.bulkWrite(bulkOps);
}

export { queryPrimaryInterests, bulkUpsertPrimaryInterests };
