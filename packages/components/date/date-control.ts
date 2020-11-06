import { Component, Input, NgModule, Type } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IDynamicModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface DateControlOptions {
    title: Translate;
    name?: string;
}

@Component({
    selector: 'date-control',
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
export class DateControl extends NgFormAccessor<string> {
    @Input() public options: DateControlOptions;
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
    exports: [DateControl],
    declarations: [DateControl],
})
export class DateControlModule implements IDynamicModule<IControl<string, DateControlOptions>> {
    public entry: Type<DateControl> = DateControl;
}
