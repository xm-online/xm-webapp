import { XmLog } from '@xm-ngx/logger';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class XmLogBroker {
    public abstract dispatch(log: XmLog): void;

    public abstract log$(): Observable<XmLog>;
}
