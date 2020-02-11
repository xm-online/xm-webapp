import {OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';

export interface IRequestCache<T> extends OnDestroy {
    cache$: () => Observable<T | null>;
    forceReload: () => void;
    ngOnDestroy: () => void;
    clear: () => void;
}
