import winston from 'winston';
import 'winston-daily-rotate-file';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const { combine, timestamp, json, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} ${level}: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`;
});

const options = {
  file: {
    level: 'info',
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    format: combine(
      timestamp(),
      json()
    )
  },
  error: {
    level: 'error',
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    format: combine(
      timestamp(),
      json()
    )
  },
  console: {
    level: 'debug',
    format: combine(
      colorize(),
      timestamp(),
      customFormat
    )
  }
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile(options.file),
    new winston.transports.DailyRotateFile(options.error),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
});

export default logger; 