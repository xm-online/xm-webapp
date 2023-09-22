import { CommonModule } from '@angular/common';
import {
    Component,
    forwardRef,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { HintModule } from '@xm-ngx/components/hint';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { XmAutocompleteControl } from './autocomplete-control';
import { MatInputModule } from '@angular/material/input';
import { XmTableColumnDynamicCellsComponent } from '@xm-ngx/components/table';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { XmAutocompleteControlListItem } from './autocomple-control.interface';
import { XmEntity } from '@xm-ngx/core/entity';
import { distinctUntilChanged, Observable, of, startWith, switchMap } from 'rxjs';

@Pipe({
    standalone: true,
    name: 'rowCheckedPipe',
    pure: true,
})
export class RowCheckedPipe implements PipeTransform {
    public transform(
        value: XmAutocompleteControlListItem,
        selection: SelectionModel<XmAutocompleteControlListItem>,
    ): Observable<boolean> {
        return selection.changed.pipe(
            startWith(null),
            switchMap(() => of(selection.isSelected(value))),
            distinctUntilChanged(),
        );
    }
}

@Component({
    standalone: true,
    selector: 'xm-autocomplete-table-control',
    template: `
        <mat-form-field>
            <mat-label>{{config.title | translate}}</mat-label>
            <input
                matInput
                [formControl]="searchQueryControl"
                [placeholder]="(config.placeholder || config.title) | translate">

            <div matSuffix class="ms-3 me-3">
                <mat-progress-spinner diameter="24" mode="indeterminate" *ngIf="loading | async"></mat-progress-spinner>
            </div>
        </mat-form-field>

        <div [style.height.px]="config.height" class="overflow-auto">
            <table mat-table [dataSource]="list" [trackBy]="trackBy.bind(this)">
                <ng-container [matColumnDef]="selectionColumnName">
                    <th mat-header-cell [style.width.px]="width" *matHeaderCellDef>
                        <mat-checkbox
                            *ngIf="config.multiple && (list | async)?.length > 0"
                            (change)="$event ? toggleAllRows() : null"
                            [checked]="isAllChecked()"
                            [disabled]="disabled"
                            [indeterminate]="isAllIndeterminate()">
                        </mat-checkbox>
                    </th>
                    <td mat-cell [style.width.px]="width" *matCellDef="let row">
                        <mat-checkbox
                            (click)="$event.stopPropagation()"
                            (change)="$event ? toggleRow(row) : null"
                            [disabled]="disabled"
                            [checked]="row | rowCheckedPipe : selection | async"
                        ></mat-checkbox>
                    </td>
                </ng-container>

                <xm-table-column-dynamic-cells [column]="column"
                                *ngFor="let column of config.columns"></xm-table-column-dynamic-cells>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns" (click)="toggleRow(row)"></tr>

                <tr *matNoDataRow>
                    <td class="text-center p-3" [attr.colspan]="displayedColumns.length">
                        {{config.searchPlaceholder | translate}}
                    </td>
                </tr>
            </table>
        </div>
    `,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        FormsModule,
        XmTableColumnDynamicCellsComponent,
        MatCheckboxModule,
        MatTableModule,
        XmTranslationModule,
        MatIconModule,
        CommonModule,
        HintModule,
        RowCheckedPipe,
    ],
    providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => XmAutocompleteTableControl), multi: true } ],
})
export class XmAutocompleteTableControl extends XmAutocompleteControl {
    public width = 44;
    public selectionColumnName = '_selection';

    public get displayedColumns(): string[] {
        return [this.selectionColumnName].concat(this.config.columns.map(c => c.name));
    }

    public trackBy = (index: number, item: XmEntity<unknown>): string | number => {
        const { id = index } = this.identityFormat<{ id: string; }>(item) ?? {};

        return id;
    };

    public isAllIndeterminate(): boolean {
        return this.selection.hasValue() && !this.isAllSelected();
    }

    public isAllChecked(): boolean {
        return this.selection.hasValue() && this.isAllSelected();
    }

    public isAllSelected(): boolean {
        return this.selection.selected.length === this.list.value.length;
    }

    public toggleRow(row: XmAutocompleteControlListItem): void {
        if (this.disabled) {
            return;
        }

        this.selection.toggle(row);

        this.change(this.selection.selected);
    }

    public toggleAllRows(): void {
        if (this.disabled) {
            return;
        }

        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            this.selection.select(...this.list.value);
        }

        this.change(this.selection.selected);
    }
}
