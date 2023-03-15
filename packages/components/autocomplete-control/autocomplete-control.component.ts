import { CommonModule } from '@angular/common';
import {
    Component,
    forwardRef
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

@Component({
    standalone: true,
    selector: 'xm-autocomplete-control',
    template: `
        <mat-form-field>
            <mat-label *ngIf="config?.title">{{ config?.title | translate }}</mat-label>

            <mat-select [multiple]="config?.multiple"
                        [disabled]="disabled"
                        [ngModel]="selected"
                        [compareWith]="identityFn"
                        (selectionChange)="change($event.value)">

                <mat-option>
                    <ngx-mat-select-search 
                        [clearSearchInput]="false"
                        [formControl]="searchQueryControl"
                        [placeholderLabel]="config.searchPlaceholder | translate"
                        [noEntriesFoundLabel]="config.notFoundSearchPlaceholder | translate"></ngx-mat-select-search>
                </mat-option>

                <div class="mt-1 mb-1" style="height: var(--mdc-linear-progress-track-height, 4px)">
                    <mat-progress-bar mode="indeterminate" *ngIf="loading | async"></mat-progress-bar>
                </div>
                
                <div class="mat-mdc-option" [hidden]="!selected" (click)="deselect()">
                    <mat-icon>close</mat-icon>
                    {{'common-webapp-ext.buttons.cancel' | translate}}
                </div>

                <ng-container *ngIf="(list | async)?.length > 0; then listing"></ng-container>

                <ng-template #listing>
                    <mat-option *ngFor="let s of list | async"
                                [value]="s.value">
                        {{s.view | translate}}
                    </mat-option>
                </ng-template>
            </mat-select>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        FormsModule,
        XmTranslationModule,
        MatIconModule,
        CommonModule,
        HintModule,
    ],
    providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => XmAutocompleteControlComponent), multi: true } ],
})
export class XmAutocompleteControlComponent extends XmAutocompleteControl {
}