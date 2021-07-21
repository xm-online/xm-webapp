import { CommonModule } from '@angular/common';
import {Component, Input, NgModule} from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicEntryModule, XmDynamicControl, XmDynamicControlConstructor } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmDateValue } from './xm-date.component';
import {MatDatepickerInputEvent} from '@angular/material/datepicker/datepicker-input-base';

export interface XmDateControlOptions {
    title: Translate;
    name?: string;
    required?: boolean;
    useUtc?: boolean;
}

@Component({
    selector: 'xm-date-control',
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

        </mat-form-field>
    `,
})
export class XmDateControl extends NgFormAccessor<XmDateValue>{
    @Input() public options: XmDateControlOptions;

    public changeDateControl({value}: MatDatepickerInputEvent<unknown>): void {
        if (value instanceof Date) {

            if (this.options?.useUtc) {
                const utcDate = new Date(
                    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
                );
                this.control.setValue(utcDate, {emitEvent: true});
            }
        }
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
    ],
    exports: [XmDateControl],
    declarations: [XmDateControl],
})
export class XmDateControlModule implements XmDynamicEntryModule<XmDynamicControl<XmDateValue, XmDateControlOptions>> {
    public entry: XmDynamicControlConstructor<XmDateValue, XmDateControlOptions> = XmDateControl;
}
