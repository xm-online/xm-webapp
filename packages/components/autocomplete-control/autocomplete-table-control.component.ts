import { CommonModule } from '@angular/common';
import {
    Component,
    forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { HintModule } from '@xm-ngx/components/hint';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { XmAutocompleteControl } from './autocomplete-control';
import { MatInputModule } from '@angular/material/input';
import { XmTableColumnDynamicCellsModule } from '../table';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { takeUntilOnDestroy } from '@xm-ngx/shared/operators';
import { XmAutocompleteControlListItem } from './autocomple-control.interface';

@Component({
    standalone: true,
    selector: 'xm-autocomplete-table-control',
    template: `
        <mat-form-field>
            <mat-label>{{config.title | translate}}</mat-label>
            <input 
                matInput 
                [formControl]="searchQueryControl"
                [placeholder]="config.title | translate">
        </mat-form-field>

        <div class="mt-1 mb-1" style="height: var(--mdc-linear-progress-track-height, 4px)">
            <mat-progress-bar mode="indeterminate" *ngIf="loading | async"></mat-progress-bar>
        </div>

        <div [style.height.px]="config.height" class="overflow-auto">
            <table mat-table [dataSource]="list">
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
                            [checked]="isChecked(row)">
                        </mat-checkbox>
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
        MatProgressBarModule,
        ReactiveFormsModule,
        FormsModule,
        XmTableColumnDynamicCellsModule,
        MatCheckboxModule,
        MatTableModule,
        XmTranslationModule,
        MatIconModule,
        CommonModule,
        HintModule,
    ],
    providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => XmAutocompleteTableControlComponent), multi: true } ],
})
export class XmAutocompleteTableControlComponent extends XmAutocompleteControl {
    public width = 44;
    public selectionColumnName = '_selection';

    public get displayedColumns(): string[] {
        return [this.selectionColumnName].concat(this.config.columns.map(c => c.name));
    }

    public selection: SelectionModel<XmAutocompleteControlListItem>;
  
    public isAllIndeterminate(): boolean {
        return this.selection.hasValue() && !this.isAllSelected();
    }

    public isAllChecked(): boolean {
        return this.selection.hasValue() && this.isAllSelected();
    }

    public isChecked(row: XmAutocompleteControlListItem): boolean {
        return this.selection.isSelected(row);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.selection = new SelectionModel<XmAutocompleteControlListItem>(true, [], true, this.identityFn);

        this.fetchedList.pipe(
            takeUntilOnDestroy(this),
        ).subscribe(values => {
            this.selection.select(...values );
        });
    }

    public isAllSelected(): boolean {
        return this.selection.selected.length === this.list.value.length;
    }

    public toggleRow(row: XmAutocompleteControlListItem): void {
        if (this.disabled) {
            return;
        }

        this.selection.toggle(row);

        this.change(this.unwrapValues(this.selection.selected));
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

        this.change(this.unwrapValues(this.selection.selected));
    }
}