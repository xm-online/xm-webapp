import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmDynamicControl, XmDynamicControlConstructor, XmDynamicEntryModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmDateControlOptions } from './xm-date-control';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { HintModule } from '@xm-ngx/components/hint';
import { OwlMomentDateTimeModule } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS } from '@danielmoncada/angular-datetime-picker';

export interface XmDatetimeControlOptions extends XmDateControlOptions {
    ignoreSeconds: boolean;
    startAt?: XmDateTimeControlValue;
}


const MY_CUSTOM_FORMATS = {
    parseInput: 'YYYY/MM/DD HH:mm:ss',
    fullPickerInput: 'YYYY/MM/DD HH:mm:ss',
    datePickerInput: 'YYYY/MM/DD HH:mm:ss',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

type XmDateTimeControlValue = moment.Moment | string;

@Component({
    selector: 'xm-datetime-control',
    template: `
        <mat-form-field>
            <mat-label>{{config?.title | translate}}</mat-label>

            <input [formControl]="control"
                   [owlDateTime]="dt1"
                   [owlDateTimeTrigger]="dt1"
                   [name]="config?.name"
                   [required]="config?.required"
                   matInput>
            <owl-date-time #dt1 [startAt]="config?.startAt || null">
            </owl-date-time>

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

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
})
export class XmDatetimeControl extends NgFormAccessor<XmDateTimeControlValue> implements OnInit, OnDestroy {
    @Input() public config: XmDatetimeControlOptions;

    public ngOnInit(): void {
        super.ngOnInit();

        this.control.valueChanges.pipe(
            takeUntilOnDestroy(this),
            filter(value => !!value),
            map((value) => {
                return moment.isMoment(value) ? value : moment(value);
            }),
            filter(value => value.seconds() !== 0 && this.config.ignoreSeconds),
        ).subscribe((value: moment.Moment) => {
            this.control.patchValue(value.seconds(0));
        });
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
        OwlMomentDateTimeModule,
        HintModule,
    ],
    providers: [
        {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
    ],
    exports: [XmDatetimeControl],
    declarations: [XmDatetimeControl],
})
export class XmDatetimeControlModule implements XmDynamicEntryModule<XmDynamicControl<XmDateTimeControlValue, XmDatetimeControlOptions>> {
    public entry: XmDynamicControlConstructor<XmDateTimeControlValue, XmDatetimeControlOptions> = XmDatetimeControl;
}
