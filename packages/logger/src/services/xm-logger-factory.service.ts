import { Injectable } from '@angular/core';
import { XmConsoleLogger } from '../loggers/xm-console-logger';
import { XmLoggerFactory } from '../interfaces/xm-logger-factory';
import { XmLogBroker } from '../interfaces/xm-log-broker';
import { XmLogger } from '../interfaces/xm-logger';

export interface XmLoggerFactoryOptions {
    name: string,
    broker?: XmLogBroker,
}

@Injectable()
/**
 * The default XmLoggerFactory implementation
 */
export class XmLoggerFactoryDefault implements XmLoggerFactory {
    constructor(private logBroker: XmLogBroker) {
    }

    public create(options: XmLoggerFactoryOptions): XmLogger {
        if (!options) {
            options = { name: '' };
        }
        if (!options.broker) {
            options.broker = this.logBroker;
        }
        return new XmConsoleLogger(options.name, options.broker);
    }
}
