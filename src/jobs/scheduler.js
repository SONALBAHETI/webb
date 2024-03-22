import agenda from "../config/agenda.js";
import logger from "../config/logger.js";
import { intervalJobs } from "./index.js";

// import jobs
import deleteInactiveAccounts from "./deleteInactiveAccounts.js";

// define and schedule jobs
const defineAndScheduleJobs = () => {
  intervalJobs.forEach((job) => {
    // define job
    agenda.define(job.name, job.script);

    // add event listeners
    agenda.on(`start:${job.name}`, () => {
      logger.info(`Job ${job.name} started ⌛`);
    });
    agenda.on(`success:${job.name}`, () => {
      logger.info(`Job ${job.name} succeeded ✅`);
    });
    agenda.on(`fail:${job.name}`, (error) => {
      logger.error(`Job ${job.name} failed ❌`, error);
    });

    // schedule job
    agenda.every(job.every, job.name);
  });
  agenda.define("delete inactive accounts", deleteInactiveAccounts);
};

// start agenda function
const startJobScheduler = () => {
  agenda.on("ready", () => {
    try {
      logger.info("Starting agenda...");
      agenda.start();
      logger.info("Defining and scheduling jobs...");
      defineAndScheduleJobs();
      logger.info("Jobs scheduled ✅");
    } catch (error) {
      logger.error("Failed to start Agenda:", error);
    }
  });
};

export default startJobScheduler;
