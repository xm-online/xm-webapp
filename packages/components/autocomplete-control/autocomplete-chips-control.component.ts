import { CommonModule } from '@angular/common';
import {
    Component,
    forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { HintModule } from '@xm-ngx/components/hint';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { XmAutocompleteControl } from './autocomplete-control';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { XmAutocompleteControlListItem } from './autocomple-control.interface';
import { MatButtonModule } from '@angular/material/button';
import { XmEmptyPipe } from '@xm-ngx/pipes';

@Component({
    standalone: true,
    selector: 'xm-autocomplete-chips-control',
    template: `
        <mat-form-field>
            <mat-label *ngIf="config?.title">{{ config?.title | translate }}</mat-label>

            <mat-chip-grid #chipGrid [formControl]="chipControl">
                <mat-chip-row *ngFor="let s of selected" (removed)="remove(s)">
                    {{s.view | translate}}
                    <button matChipRemove>
                        <mat-icon>cancel</mat-icon>
                    </button>
                </mat-chip-row>
            </mat-chip-grid>

            <input
                #input
                [placeholder]="config.searchPlaceholder | translate"
                [formControl]="searchQueryControl"
                [matAutocomplete]="auto"
                [matChipInputFor]="chipGrid">

            <mat-autocomplete #auto="matAutocomplete" (optionSelected)="select($event)">
                <mat-option *ngFor="let item of list | async" [value]="item">
                {{item.view}}
                </mat-option>
            </mat-autocomplete>

            <div matSuffix class="d-flex align-items-center ms-3 me-3">
                <mat-progress-spinner diameter="24" mode="indeterminate" *ngIf="loading | async"></mat-progress-spinner>
                <button mat-icon-button *ngIf="!(selected | xmEmpty)" [disabled]="disabled" (click)="deselect()">
                    <mat-icon>close</mat-icon>
                </button>
            </div>

            <mat-error
                *xmControlErrors="ngControl?.control?.errors; translates (config.errors || messageErrors); message as message">{{message}}</mat-error>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    styles: [`
        .loader {
            height: var(--mdc-linear-progress-track-height, 4px);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 2;
        }
    `],
    imports: [
        MatFormFieldModule,
        MatChipsModule,
        MatAutocompleteModule,
        NgxMatSelectSearchModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        FormsModule,
        XmTranslationModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        HintModule,
        ControlErrorModule,
        XmEmptyPipe,
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => XmAutocompleteChipsControlComponent),
        multi: true,
    }],
})
export class XmAutocompleteChipsControlComponent extends XmAutocompleteControl {
    public chipControl = new FormControl(null);

    public deselect(): void {
        this.selection.clear();
        this.change(null);
    }

    public remove(item: XmAutocompleteControlListItem): void {
        if (this.disabled) {
            return;
        }

        this.selection.toggle(item);

        this.change(this.selection.selected);
    }

    public select(event: MatAutocompleteSelectedEvent): void {
        this.change(event.option.value);
    }

    public setDisabledState(isDisabled: boolean): void {
        isDisabled
            ? this.chipControl.disable({emitEvent: false})
            : this.chipControl.enable({emitEvent: false});

        super.setDisabledState(isDisabled);
    }

}
