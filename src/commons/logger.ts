export type LoggerHandler = (log: string) => void;

export default class Logger {

    handler: LoggerHandler;

    constructor(handler: LoggerHandler = () => {}) {
        this.handler = handler;
    }

    info(log: string) {
        this.handler(`[INFO] ${log}`);
    }

    warn(log: string) {
        return this.handler(`[WARN] ${log}`);
    }

    error(log: string) {
        return this.handler(`[ERROR] ${log}`);
    }

    setHandler(handler: LoggerHandler) {
        this.handler = handler;
    }

}