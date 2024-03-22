import User from "../models/user.model.js";
import logger from "../config/logger.js";

/**
 * Deletes accounts where isActive is false and deletionScheduledAt date is in the past
 */
const deleteInactiveAccounts = async () => {
  const deletionCriteria = {
    "accountStatus.isActive": false,
    "accountStatus.deletionScheduledAt": { $lte: Date.now() },
  };
  const deleteResult = await User.deleteMany(deletionCriteria);
  logger.info(`Deleted ${deleteResult.deletedCount} inactive accounts`);
};

export default deleteInactiveAccounts;
