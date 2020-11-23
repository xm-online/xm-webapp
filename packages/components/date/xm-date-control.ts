import { Component, Input, NgModule } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmDateValue } from './xm-date.component';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IControlFn, IDynamicModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface XmDateControlOptions {
    title: Translate;
    name?: string;
}

@Component({
    selector: 'xm-date-control',
    template: `
        <mat-form-field>
            <mat-label>{{options?.title | translate}}</mat-label>
            <input [formControl]="control"
                   [matDatepicker]="picker"
                   [name]="options?.name"
                   (click)="picker.open()"
                   matInput>
            <mat-datepicker-toggle [for]="picker" matSuffix></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
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
    ],
    exports: [XmDateControl],
    declarations: [XmDateControl],
})
export class XmDateControlModule implements IDynamicModule<IControl<XmDateValue, XmDateControlOptions>> {
    public entry: IControlFn<XmDateValue, XmDateControlOptions> = XmDateControl;
}
