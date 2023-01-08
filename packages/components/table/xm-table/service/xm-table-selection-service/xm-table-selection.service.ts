import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class XmTableSelectionService<T> {
    public selection: SelectionModel<T>;
    private selectAll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {
        const allowMultiSelect = true;
        const initialSelection = [];
        this.selection = new SelectionModel<T>(allowMultiSelect, initialSelection);
    }

    public toggleAll(all: boolean): void {
        this.selectAll.next(all);
    }
}
