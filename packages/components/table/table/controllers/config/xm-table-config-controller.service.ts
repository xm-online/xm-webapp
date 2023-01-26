import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class XmTableConfigController<T = unknown> {

    public config$(): Observable<T>{
        // TODO:
        return null;
    }
}
