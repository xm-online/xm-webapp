import {CommonModule} from '@angular/common';
import {Component, Input, NgModule, OnDestroy, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ControlErrorModule} from '@xm-ngx/components/control-error';
import {XmDynamicControl, XmDynamicControlConstructor, XmDynamicEntryModule} from '@xm-ngx/dynamic';
import {XmTranslationModule} from '@xm-ngx/translation';
import {XmDateValue} from './xm-date.component';
import {XmDateControlOptions} from '@xm-ngx/components/date/xm-date-control';
import {DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeModule} from 'ng-pick-datetime';
import {NgFormAccessor} from '@xm-ngx/components/ng-accessor';
import {MomentDateTimeAdapter} from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
import {Moment} from 'moment';
import {takeUntilOnDestroy, takeUntilOnDestroyDestroy} from '@xm-ngx/shared/operators';


export interface XmDatetimeControlOptions extends XmDateControlOptions {
    ignoreSeconds: boolean;
}


const MY_CUSTOM_FORMATS = {
    fullPickerInput: 'YYYY/MM/DD HH:mm:ss',
    parseInput: 'YYYY/MM/DD HH:mm:ss',
    datePickerInput: 'YYYY/MM/DD HH:mm:ss',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
};


@Component({
    selector: 'xm-datetime-control',
    template: `
        <mat-form-field>
            <mat-label>{{options?.title | translate}}</mat-label>

            <input [formControl]="control"
                   [owlDateTime]="dt1"
                   [owlDateTimeTrigger]="dt1"
                   [name]="options?.name"
                   [required]="options?.required"
                   matInput>
            <owl-date-time #dt1></owl-date-time>

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
export class XmDatetimeControl extends NgFormAccessor<XmDateValue> implements OnInit, OnDestroy{
    @Input() public options: XmDatetimeControlOptions;

    public ngOnInit(): void {
        super.ngOnInit();

        this.control.valueChanges
            .pipe(
                takeUntilOnDestroy(this)
            )
            .subscribe((value: Moment) => {
                if (!value) {
                    return;
                }
                if ((this.control.value as Moment)?.seconds() !== 0 && this.options.ignoreSeconds) {
                    this.control.patchValue(value.seconds(0));
                }
            })
    }


    public ngOnDestroy(): void {
        super.ngOnDestroy();
        takeUntilOnDestroyDestroy(this);
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
        OwlDateTimeModule,
    ],
    providers: [
        {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
        {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS}
    ],
    exports: [XmDatetimeControl],
    declarations: [XmDatetimeControl],
})
export class XmDatetimeControlModule implements XmDynamicEntryModule<XmDynamicControl<XmDateValue, XmDatetimeControlOptions>> {
    public entry: XmDynamicControlConstructor<XmDateValue, XmDatetimeControlOptions> = XmDatetimeControl;
}
