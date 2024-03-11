import winston from "winston";
import config from "./config.js";
import path from "path";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const printf = (prettify) =>
  winston.format.printf(
    ({ level, message, label, timestamp, metadata }) =>
      `${timestamp} ${level} [${label}]: ${message} ${
        Object.keys(metadata).length
          ? JSON.stringify(metadata, null, prettify ? 2 : undefined)
          : ""
      }`
  );

const consoleTransport = new winston.transports.Console({
  stderrLevels: ["error"],
  format: winston.format.combine(winston.format.colorize(), printf(true)),
});

const fileTransport = new winston.transports.File({
  filename: "./logs/combined.log",
  format: winston.format.combine(winston.format.uncolorize(), printf()),
});

const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.label({
      label: path.basename(new URL(import.meta.url).pathname),
    }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    config.env === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.metadata({
      fillExcept: ["message", "level", "timestamp", "label"],
    })
  ),
  transports:
    config.env === "development" ? [consoleTransport] : [fileTransport],
});

export default logger;
