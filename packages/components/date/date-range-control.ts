import { Component, Input, NgModule, Type } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface DateRangeControlOptions {
    title: Translate;
    fromName?: string;
    toName?: string;
}

@Component({
    selector: 'date-range-control',
    template: `
        <mat-form-field>
            <mat-label>{{options?.title | translate}}</mat-label>
            <mat-date-range-input [formGroup]="formGroup"
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
        </mat-form-field>
    `,
})
export class DateRangeControl extends NgControlAccessor<{ from: string, to: string }> {
    @Input() public options: DateRangeControlOptions;
    @Input() public formGroup: FormGroup = new FormGroup({
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
    ],
    exports: [DateRangeControl],
    declarations: [DateRangeControl],
})
export class DateRangeControlModule {
    public entry: Type<DateRangeControl> = DateRangeControl;
}
