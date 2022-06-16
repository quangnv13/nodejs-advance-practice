const winston = require("winston");

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
    trace: 6
};

const colors = {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'white',
    trace: 'white',
    http: 'magenta',
  }

  winston.addColors(colors);

const format = winston.format.combine(
    // Add the message timestamp with the preferred format
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // Tell Winston that the logs must be colored
    winston.format.colorize({ all: true }),
    // Define the format of the message showing the timestamp, the level and the message
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  )

const transports = [
    // Allow the use the console to print the messages
    new winston.transports.Console(),
    // Allow to print all the error level messages inside the error.log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Allow to print all the error message inside the all.log file
    // (also the error log that are also printed inside the error.log(
    new winston.transports.File({ filename: 'logs/all.log' }),
  ]
  
  // Create the logger instance that has to be exported
  // and used to log messages.
  const logger = winston.createLogger({
    level: 'debug',
    levels: logLevels,
    format,
    transports,
  })
  
  module.exports = logger