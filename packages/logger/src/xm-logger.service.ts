import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {XmConsoleLogger} from './xm-console.logger';
import {XmLogger} from './xm.logger';

export type LogLevel = 'debug' | 'error' | 'info' | 'warn';

export interface Log {
    timeStamp: string;
    level: LogLevel;
    name: string;
    message: string;
}


@Injectable()
export class XmLoggerService implements XmLogger {

    public logger = new XmConsoleLogger('', this);
    public log$: Subject<Log> = new Subject<Log>();

    public create(options: { name: string }): XmLogger {
        return new XmConsoleLogger(options.name, this);
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
