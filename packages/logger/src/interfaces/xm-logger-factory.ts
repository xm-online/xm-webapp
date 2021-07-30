import { XmLoggerFactoryOptions } from '../services/xm-logger-factory.service';
import { Injectable } from '@angular/core';
import { XmLogger } from './xm-logger';

@Injectable()
/**
 * @public
 * XmLoggerFactory produces loggers based on options
 */
export abstract class XmLoggerFactory {
    public abstract create(options: XmLoggerFactoryOptions): XmLogger;
}
