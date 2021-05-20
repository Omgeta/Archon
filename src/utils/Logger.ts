import winston from "winston";
import "winston-daily-rotate-file";

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    module: 3,
    modwarn: 4,
    modinfo: 5,
    debug: 6
};

winston.addColors({
    error: "red",
    warn: "yellow",
    info: "green",
    modules: "cyan",
    modwarn: "yellow",
    modinfo: "green",
    debug: "blue"
});

export const logger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        // winston.format.padLevels({ levels: logLevels }),
        winston.format.timestamp(),
        winston.format.printf(log => `${log.timestamp} [${log.level.toUpperCase()}] - ${log.message}`)
    ),
    transports: [
        new winston.transports.Console({ format: winston.format.colorize() }),
        new winston.transports.DailyRotateFile({
            filename: "application-%DATE%.log",
            dirname: "logs",
            datePattern: "YYYY-MM-DD-HH",
            maxSize: "20m",
            maxFiles: "14d"
        })
    ],
    level: "debug"
});