import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { XmLog } from './xm-log.interface';

@Injectable()
/**
 * @public
 * Pub/Sub for loggers events
 */
export abstract class XmLogBroker {
    public abstract dispatch(log: XmLog): void;

    public abstract log$(): Observable<XmLog>;
}
