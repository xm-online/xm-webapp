import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class XmTableConfigController<T = unknown> {
    private _config: BehaviorSubject<T> = new BehaviorSubject<T>(null);
    public config$(): Observable<T> {
        return this._config;
    }
    public change(config: T): void {
        this._config.next(config);
    }

    public get config(): T | null {
        return this._config.value;
    }
}
