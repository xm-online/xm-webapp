import { Component, Input, NgModule, Type } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IDynamicModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface DateRangeControlOptions {
    title: Translate;
    fromName?: string;
    toName?: string;
}

export interface DateRangeControlValue {
    from: string,
    to: string
}

@Component({
    selector: 'date-range-control',
    template: `
        <mat-form-field>
            <mat-label>{{options?.title | translate}}</mat-label>
            <mat-date-range-input [formGroup]="group"
                                  [rangePicker]="picker">
                <input matStartDate
                       [name]="options?.fromName"
                       formControlName="from">
                <input matEndDate
                       formControlName="to"
                       [name]="options?.toName">
            </mat-date-range-input>
            <mat-datepicker-toggle [for]="picker" matSuffix></mat-datepicker-toggle>
            <mat-date-range-picker #picker></mat-date-range-picker>
            <mat-error *xmControlErrors="group?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
})
export class DateRangeControl extends NgControlAccessor<DateRangeControlValue> {
    @Input() public options: DateRangeControlOptions;
    @Input() public group: FormGroup = new FormGroup({
        from: new FormControl(),
        to: new FormControl(),
    });
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
    exports: [DateRangeControl],
    declarations: [DateRangeControl],
})
export class DateRangeControlModule implements IDynamicModule<IControl<DateRangeControlValue, DateRangeControlOptions>> {
    public entry: Type<DateRangeControl> = DateRangeControl;
}
