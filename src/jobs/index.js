import deleteInactiveAccounts from "./deleteInactiveAccounts.js";

/**
 * @typedef {Object} IntervalJob
 * @property {string} name - The name of the job
 * @property {function(): Promise<void>} script - The job function
 * @property {string} every - The interval to run the job
 */

/**
 * @typedef {Array<IntervalJob>} IntervalJobs
 */

/**
 * Array of jobs to be scheduled
 * @type {IntervalJobs}
 */
const intervalJobs = [
  {
    name: "delete inactive accounts",
    script: deleteInactiveAccounts,
    every: "1 day",
  },
];

export { intervalJobs };
