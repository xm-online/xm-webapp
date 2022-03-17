import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepickerInputEvent } from '@angular/material/datepicker/datepicker-input-base';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl, XmDynamicControlConstructor, XmDynamicEntryModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmDateValue } from './xm-date.component';
import { HintModule, HintText } from '@xm-ngx/components/hint';

export interface XmStringDateControlOptions {
    hint?: HintText;
    title: Translate;
    name?: string;
    required?: boolean;
}

@Component({
    selector: 'xm-string-date-control',
    template: `
        <mat-form-field>
            <mat-label>{{options?.title | translate}}</mat-label>

            <input (dateChange)="changeDateControl($event)"
                   [formControl]="control"
                   [matDatepicker]="picker"
                   [name]="options?.name"
                   [required]="options?.required"
                   (click)="picker.open()"
                   matInput>
            <mat-datepicker-toggle [for]="picker" matSuffix></mat-datepicker-toggle>

            <mat-datepicker #picker></mat-datepicker>

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>

            <button mat-button
                    *ngIf="value"
                    matSuffix
                    mat-icon-button
                    [disabled]="control.disabled"
                    aria-label="Clear"
                    (click)="control.patchValue(''); control.markAsDirty()">
                <mat-icon>close</mat-icon>
            </button>

            <mat-hint [hint]="options.hint"></mat-hint>
        </mat-form-field>
    `,
})
export class XmStringDateControl extends NgFormAccessor<XmDateValue> {
    @Input() public options: XmStringDateControlOptions;

    public changeDateControl({ value }: MatDatepickerInputEvent<Date>): void {
        const onlyDate = new Date(
            Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
        ).toISOString().split('T')[0];
        this.control.setValue(onlyDate);
    }
}

@NgModule({
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        XmTranslationModule,
        ControlErrorModule,
        MatButtonModule,
        CommonModule,
        MatIconModule,
        HintModule,
    ],
    exports: [XmStringDateControl],
    declarations: [XmStringDateControl],
})
export class XmStringDateControlModule implements XmDynamicEntryModule<XmDynamicControl<XmDateValue, XmStringDateControlOptions>> {
    public entry: XmDynamicControlConstructor<XmDateValue, XmStringDateControlOptions> = XmStringDateControl;
}
