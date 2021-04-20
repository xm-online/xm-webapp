import {CommonModule} from '@angular/common';
import {Component, Input, NgModule} from '@angular/core';
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
import {OwlDateTimeModule} from 'ng-pick-datetime';
import {NgFormAccessor} from '@xm-ngx/components/ng-accessor';


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
export class XmDatetimeControl extends NgFormAccessor<XmDateValue> {
    @Input() public options: XmDateControlOptions;
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
    exports: [XmDatetimeControl],
    declarations: [XmDatetimeControl],
})
export class XmDatetimeControlModule implements XmDynamicEntryModule<XmDynamicControl<XmDateValue, XmDateControlOptions>> {
    public entry: XmDynamicControlConstructor<XmDateValue, XmDateControlOptions> = XmDatetimeControl;
}
