import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class XmTableEntityController<T = unknown> {

    public entity$(): Observable<T> {
    // TODO:FEATURE: support entity in context
        return null;
    }

    public update(entity: T): void {
        // TODO:FEATURE: support entity in context
    }
}
