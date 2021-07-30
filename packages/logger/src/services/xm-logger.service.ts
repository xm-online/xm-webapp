import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { XmConsoleLogger } from '../loggers/xm-console-logger';
import { XmLogger } from '../interfaces/xm-logger';
import { XmLog } from '../interfaces/xm-log.interface';
import { XmLoggerFactoryDefault, XmLoggerFactoryOptions } from './xm-logger-factory.service';
import { XmLogBrokerDefault } from './xm-log-broker.service';
import { XmLogBroker } from '../interfaces/xm-log-broker';
import { XmLoggerFactory } from '../interfaces/xm-logger-factory';

@Injectable()
/**
 * The default XmLogger implementation base on XmConsoleLogger
 */
export class XmLoggerService implements XmLogger, XmLoggerFactory, XmLogBroker {

    private logger = new XmConsoleLogger('', this);

    constructor(
        private loggerFactory: XmLoggerFactoryDefault,
        private broker: XmLogBrokerDefault,
    ) {
    }

    public create(options: XmLoggerFactoryOptions): XmLogger {
        return this.loggerFactory.create(options);
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

    public dispatch(log: XmLog): void {
        this.broker.dispatch(log);
    }

    public log$(): Observable<XmLog> {
        return this.broker.log$();
    }

}
