import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TableFilterService {

    private filterSubj = new BehaviorSubject<unknown>(null);

    constructor() {
    }

    public filters(): Observable<unknown> {
        return this.filterSubj.asObservable();
    }

    public setFilters(filters: unknown) {
        console.log(filters);
        this.filterSubj.next(filters);
    }
}
