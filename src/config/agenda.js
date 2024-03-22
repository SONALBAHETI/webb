import Agenda from "agenda";
import config from "./config.js";

const agenda = new Agenda({
  db: {
    address: config.mongoose.adminUrl,
    collection: 'scheduledJobs',
  },
});

export default agenda;