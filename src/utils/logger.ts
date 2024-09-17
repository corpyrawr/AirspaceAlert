import { IConfig } from './config';

import { Logger as WLogger, createLogger, transports, format, LogCallback } from 'winston';


export class Logger {
    private winstonLogger: WLogger;

    constructor(config: IConfig) {
        const level:string = process.env.LOG_LEVEL || config.log_level || 'info';
        const logFileName = `./logs/airspacealert-${Date.now()}.log`

        this.winstonLogger = createLogger({
            level: level,
            transports: [
              new transports.Console(),
              new transports.File({filename: logFileName})
            ],
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.printf(({ timestamp, level, message, source }) => {
                return `[${timestamp}] ${level} [${source}]: ${message}`;
                })
            )
        })
        this.debug(`Logs saved to file: ${logFileName}`, "logger")
    }

    silly(message: string, source: string)  { this.winstonLogger.silly(message, {source: source}) }
    debug(message: string, source: string)  { this.winstonLogger.debug(message, {source: source}) }
    verbose(message: string, source: string){ this.winstonLogger.verbose(message, {source: source}) }
    http(message: string, source: string)   { this.winstonLogger.http(message, {source: source}) }
    info(message: string, source: string)   { this.winstonLogger.info(message, {source: source}) }
    warn(message: string, source: string)   { this.winstonLogger.warn(message, {source: source}) }
    error(message: string, source: string)  { this.winstonLogger.error(message, {source: source}) }

}