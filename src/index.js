import mongoose from 'mongoose';
import logger from "./config/logger.js";
import config from './config/config.js';
import app from './app.js';

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});