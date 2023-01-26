import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class XmTableConfigController<T = unknown> {

    public _config: BehaviorSubject<T> = new BehaviorSubject<T>(null);

    public config$(): Observable<T> {
        return this._config;
    }

    public change(config: T): void {
        this._config.next(config);
    }
}
