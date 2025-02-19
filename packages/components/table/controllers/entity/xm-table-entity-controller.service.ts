import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class XmTableEntityController<T = unknown> {

    public entity$(): Observable<T> {
        // TODO:FEATURE: support entity in context
        return null;
    }

    public update(entity: T): void;
    public update(entity: T, asObservable?: boolean): Observable<T>;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(entity: T, asObservable = true): void | Observable<T> {
        // TODO:FEATURE: support entity in context
    }
}
