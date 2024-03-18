import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { unset } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class XmTableSelectionService<T> {
    private selections$: BehaviorSubject<Record<string, SelectionModel<T>>> = new BehaviorSubject<Record<string, SelectionModel<T>>>({});

    public createSelectionModel(): SelectionModel<T> {
        return new SelectionModel<T>(true, []);
    }

    public push<T>(key: string = 'table-selection', value: SelectionModel<T>): void {
        this.selections$.next({...this.selections$.value, [key]: value});
    }

    public get<T>(key: string = 'table-selection'): Observable<SelectionModel<T>> {
        return this.selections$.pipe(
            map(res => res[key]),
            filter<SelectionModel<T>>(Boolean),
        );
    }

    public clear(key?: string): void {
        const state = this.selections$.value;
        unset(state, key);
        this.selections$.next(state);
    }
}
