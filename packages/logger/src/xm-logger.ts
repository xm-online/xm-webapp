import { Injectable } from '@angular/core';
import { upperCase } from 'lodash';

@Injectable()
export class XmLogger {

    private logger: typeof console = console;

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
        this.logger[type](`${new Date().toISOString()} ${upperCase(type)} ${message}`);
    }

}
