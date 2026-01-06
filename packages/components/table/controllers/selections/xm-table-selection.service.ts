import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { unset } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class XmTableSelectionService<T> {
    public selection: SelectionModel<T> = new SelectionModel<T>(true, []);
    private selections$ = new BehaviorSubject({});

    private selections: Record<string, SelectionModel<T>> = {};

    public getOrCreateSelection(key: string, useMultipleModels: boolean, isMultiselect: boolean = true): SelectionModel<T> {
        if (useMultipleModels) {
            return this.getKeyedSelectionModel(key, isMultiselect);
        }

        return this.getGlobalSelectionModel(isMultiselect);
    }

    private getKeyedSelectionModel(key: string, isMultiselect: boolean): SelectionModel<T> {
        const existing = this.selections[key];
        if (!existing) {
            const created = new SelectionModel<T>(isMultiselect, []);
            this.selections[key] = created;
            return created;
        }
        if (existing.isMultipleSelection() !== isMultiselect) {
            this.recreateKeyedSelectionModel(key, isMultiselect);
        }
        return this.selections[key];
    }

    private getGlobalSelectionModel(isMultiselect: boolean): SelectionModel<T> {
        if (this.selection.isMultipleSelection() !== isMultiselect) {
            this.recreateGlobalSelectionModel(isMultiselect);
        }

        return this.selection;
    }

    private recreateKeyedSelectionModel(key: string, isMultiselect: boolean): void {
        const currentSelection = this.selections[key].selected;
        const initialItems = isMultiselect ? currentSelection : currentSelection.slice(0, 1);
        this.selections[key] = new SelectionModel<T>(isMultiselect, initialItems);
    }

    private recreateGlobalSelectionModel(isMultiselect: boolean): void {
        const currentSelection = this.selection.selected;
        const initialItems = isMultiselect ? currentSelection : currentSelection.slice(0, 1);
        this.selection = new SelectionModel<T>(isMultiselect, initialItems);
    }

    /** @deprecated Use getOrCreateSelection() instead */
    public getSelectionModel(key: string, isMultiselect: boolean = true): SelectionModel<T> {
        return this.getKeyedSelectionModel(key, isMultiselect);
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

    public getSelection<T>(key: string = 'table-selection'): SelectionModel<T> {
        return this.selections$.value[key];
    }
}
