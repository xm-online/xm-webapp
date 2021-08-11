import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { XmLogBroker } from '../interfaces/xm-log-broker';
import { XmLog } from '../interfaces/xm-log.interface';


@Injectable()
/**
 * Default XmLogBroker implementation
 */
export class XmLogBrokerDefault implements XmLogBroker {
    private log: Subject<XmLog> = new Subject<XmLog>();

    public dispatch(log: XmLog): void {
        this.log.next(log);
    }

    public log$(): Observable<XmLog> {
        return this.log.asObservable();
    }
}
