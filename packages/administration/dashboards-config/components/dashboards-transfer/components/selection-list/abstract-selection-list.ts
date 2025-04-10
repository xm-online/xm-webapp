import { SelectionModel } from '@angular/cdk/collections';
import { map, Observable, switchMap, tap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatListOption, MatSelectionListChange } from '@angular/material/list';
import { debounceTime, startWith } from 'rxjs/operators';

export type SelectionFormGroup<T> = FormGroup<{ selected: FormControl<T[]> }>;

export abstract class AbstractSelectionList<T> {
    public abstract formGroup: SelectionFormGroup<T>;
    public abstract entities$: Observable<T[]>;
    public abstract filterFn: (searchTerm: string, entities: T[]) => T[];

    public selectionModel: SelectionModel<T> = new SelectionModel<T>(true);
    public items: T[] = [];
    public searchTermControl: FormControl = new FormControl('');

    public items$: Observable<T[]>;
    public abstract trackByFn: (_: number, role: T) => unknown;

    public onSelectAll(selected: boolean): void {
        selected ? this.selectionModel.select(...this.items) : this.selectionModel.clear();
        this.formGroup.get('selected').patchValue([...this.items], { emitEvent: false });
    }

    public onSelectionChange(selection: MatSelectionListChange): void {
        const targetOption: MatListOption = selection.options[0];
        const targetValues: T[] = [targetOption.value] as T[];

        targetOption.selected ? this.selectionModel.select(...targetValues) : this.selectionModel.deselect(...targetValues);
        this.formGroup.get('selected').patchValue([...this.selectionModel.selected]);
    }

    public getEntities(): Observable<T[]> {
        return this.entities$.pipe(
            switchMap((entities: T[]) => {
                return this.searchTermControl.valueChanges.pipe(
                    startWith(this.searchTermControl.value),
                    debounceTime(500),
                    map((searchTerm: string) => this.filterFn(searchTerm, entities)),
                    tap((entities: T[]) => {
                        this.items = entities;
                    }),
                );
            }),
        );
    }
}
