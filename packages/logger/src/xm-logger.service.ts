import { Injectable } from '@angular/core';
import { upperCase } from 'lodash';

export abstract class XmLogger {
    public abstract debug(message: string): void;

    public abstract info(message: string): void;

    public abstract warn(message: string): void;

    public abstract error(message: string): void;
}

export class XmConsoleLogger implements XmLogger {

    private logger: typeof console = console;

    constructor(private name: string) {
    }

    public debug(message: string): void {
        this.format('debug', message);
    }

    public info(message: string): void {
        this.format('info', message);
    }

    public warn(message: string): void {
        this.format('warn', message);
    }

    public error(message: string): void {
        this.format('error', message);
    }

    /**
     * Temporary solution to set timestamp and type
     *
     * @experimental
     * Should be implemented via ngx-logger or alternative
     */
    private format(type: keyof typeof console, message: string): void {
        this.logger[type](`${new Date().toISOString()} ${upperCase(type)} ${this.name} ${message}`);
    }
}

@Injectable()
export class XmLoggerService implements XmLogger {

    public logger = new XmConsoleLogger('');

    public create(options: { name: string }): XmLogger {
        return new XmConsoleLogger(options.name);
    }

    public debug(message: string): void {
        return this.logger.debug(message);
    }

    public error(message: string): void {
        return this.logger.error(message);
    }

    public info(message: string): void {
        return this.logger.info(message);
    }

    public warn(message: string): void {
        return this.logger.warn(message);
    }

}
