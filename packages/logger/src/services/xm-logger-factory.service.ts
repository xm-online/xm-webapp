import { Injectable } from '@angular/core';
import { XmLogger } from '@xm-ngx/logger';
import { XmConsoleLogger } from '../loggers/xm-console-logger';
import { XmLoggerFactory } from '../interfaces/xm-logger-factory';
import { XmLogBroker } from '../interfaces/xm-log-broker';

export interface XmLoggerFactoryOptions {
    name: string,
    broker?: XmLogBroker,
}

@Injectable()
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
