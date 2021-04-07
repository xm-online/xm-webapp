import { Injectable } from '@angular/core';
import { XmConsoleLogger } from './xm-console.logger';
import { XmLogger } from './xm.logger';

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
