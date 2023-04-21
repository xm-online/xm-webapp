import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';

@Injectable()
export class XmTableSelectionService<T> {
    public selection: SelectionModel<T>;

    constructor() {
        const allowMultiSelect = true;
        const initialSelection = [];
        this.selection = new SelectionModel<T>(allowMultiSelect, initialSelection);
    }
}
