import { Component, Input, NgModule } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl, XmDynamicControlConstructor, XmDynamicEntryModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmDateValue } from './xm-date.component';

export interface XmDateRangeControlOptions {
    title: Translate;
    fromName?: string;
    toName?: string;
}

export interface XmDateRangeControlValue {
    from: XmDateValue,
    to: XmDateValue
}

@Component({
    selector: 'xm-date-range-control',
    template: `
        <mat-form-field>
            <mat-label>{{options?.title | translate}}</mat-label>
            <mat-date-range-input [formGroup]="group"
                                  [rangePicker]="picker">
                <input matStartDate
                       (focus)="picker.open()"
                       [name]="options?.fromName"
                       formControlName="from">
                <input matEndDate
                       (focus)="picker.open()"
                       formControlName="to"
                       [name]="options?.toName">
            </mat-date-range-input>
            <mat-datepicker-toggle [for]="picker" matSuffix></mat-datepicker-toggle>
            <mat-date-range-picker #picker></mat-date-range-picker>
            <mat-error *xmControlErrors="group?.errors || group?.controls.from?.errors || group?.controls.to?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
})
export class XmDateRangeControl extends NgControlAccessor<XmDateRangeControlValue> {
    @Input() public options: XmDateRangeControlOptions;
    @Input() public group: FormGroup = new FormGroup({
        from: new FormControl(),
        to: new FormControl(),
    });

    @Input()
    public set value(value: XmDateRangeControlValue) {
        this.group.patchValue(value, { emitEvent: false });
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
    ],
    exports: [XmDateRangeControl],
    declarations: [XmDateRangeControl],
})
export class XmDateRangeControlModule implements XmDynamicEntryModule<XmDynamicControl<XmDateRangeControlValue, XmDateRangeControlOptions>> {
    public entry: XmDynamicControlConstructor<XmDateRangeControlValue, XmDateRangeControlOptions> = XmDateRangeControl;
}
