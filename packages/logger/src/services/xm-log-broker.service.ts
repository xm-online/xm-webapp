import { Injectable } from '@angular/core';
import { XmLog } from '@xm-ngx/logger';
import { Observable, Subject } from 'rxjs';
import { XmLogBroker } from '../interfaces/xm-log-broker';


@Injectable()
export class XmLogBrokerDefault implements XmLogBroker {
    private log: Subject<XmLog> = new Subject<XmLog>();

    public dispatch(log: XmLog): void {
        this.log.next(log);
    }

    public log$(): Observable<XmLog> {
        return this.log.asObservable();
    }
}
