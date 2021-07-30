import { XmLogger } from '@xm-ngx/logger';
import { XmLoggerFactoryOptions } from '../services/xm-logger-factory.service';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class XmLoggerFactory {
    public abstract create(options: XmLoggerFactoryOptions): XmLogger;
}
