import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IControlFn, DynamicModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmDateValue } from './xm-date.component';

export interface XmDateControlOptions {
    title: Translate;
    name?: string;
    required?: boolean;
}

@Component({
    selector: 'xm-date-control',
    template: `
        <mat-form-field>
            <mat-label>{{options?.title | translate}}</mat-label>

            <input [formControl]="control"
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
                    aria-label="Clear"
                    (click)="control.patchValue('')">
                <mat-icon>close</mat-icon>
            </button>

        </mat-form-field>
    `,
})
export class XmDateControl extends NgFormAccessor<XmDateValue> {
    @Input() public options: XmDateControlOptions;
    @Input() public control: FormControl = new FormControl();
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
export class XmDateControlModule implements DynamicModule<IControl<XmDateValue, XmDateControlOptions>> {
    public entry: IControlFn<XmDateValue, XmDateControlOptions> = XmDateControl;
}
