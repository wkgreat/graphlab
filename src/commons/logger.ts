export const LoggerLevel = {
    DEBUG: { level: 0, token: "DEBUG" },
    INFO: { level: 1, token: "INFO" },
    WARN: { level: 2, token: "WARN" },
    ERROR: { level: 3, token: "ERROR" }
} as const;

export type LoggerLevel = typeof LoggerLevel[keyof typeof LoggerLevel];

export type LoggerHandler = (log: string, level: LoggerLevel) => void;


export default class Logger {

    handler: LoggerHandler;
    level: number = LoggerLevel.WARN.level;

    constructor(handler: LoggerHandler = () => {}) {
        this.handler = handler;
    }

    debug(log: string) {
        if (LoggerLevel.DEBUG.level >= this.level) {
            this.handler(`[${LoggerLevel.DEBUG.token}] ${log}`, LoggerLevel.DEBUG);
        }
    }

    info(log: string) {
        if (LoggerLevel.INFO.level >= this.level) {
            this.handler(`[${LoggerLevel.INFO.token}] ${log}`, LoggerLevel.INFO);
        }
    }

    warn(log: string) {
        if (LoggerLevel.WARN.level >= this.level) {
            this.handler(`[${LoggerLevel.WARN.token}] ${log}`, LoggerLevel.WARN);
        }
    }

    error(log: string) {
        if (LoggerLevel.ERROR.level >= this.level) {
            this.handler(`[${LoggerLevel.ERROR.token}] ${log}`, LoggerLevel.ERROR);
        }
    }

    setHandler(handler: LoggerHandler) {
        this.handler = handler;
    }

    setLevel(level: number | LoggerLevel) {
        if (typeof level === 'number') {
            this.level = level;
        } else {
            this.level = level.level;
        }
    }

}

const logger = new Logger();

logger.setHandler((msg, level) => {
    if (level === LoggerLevel.DEBUG || level === LoggerLevel.INFO) {
        console.log(msg);
    } else if (level === LoggerLevel.WARN) {
        console.warn(msg);
    } else {
        console.error(msg);
    }
});

logger.setLevel(LoggerLevel.DEBUG);

export { logger };