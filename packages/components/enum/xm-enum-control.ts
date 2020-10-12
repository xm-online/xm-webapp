import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

import * as _ from 'lodash';

export interface EnumControlOptions {
    title?: Translate;
    enum: EnumOption[]
}

export interface EnumOption {
    title: Translate;
    value: string;
    icon?: string;
}

const DEFAULT: EnumControlOptions = {
    title: '',
    enum: [],
};

@Component({
    selector: 'xm-enum-control',
    template: `
        <mat-form-field>
            <mat-select [formControl]="formControl"
                        [disabled]="disabled"
                        (ngModelChange)="change($event)"
                        [placeholder]="options?.title | translate">
                <mat-option *ngFor="let s of _list" [value]="s.value">
                    <mat-icon *ngIf="s.icon">{{s.icon}}</mat-icon>
                    {{s.title | translate}}
                </mat-option>
            </mat-select>

            <mat-error *xmControlErrors="formControl?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumControl extends NgControlAccessor<string> implements IControl<string, EnumControlOptions> {
    @Input() public disabled: boolean;
    @Input() public formControl: FormControl = new FormControl();

    public _list: EnumOption[];
    private _options: EnumControlOptions;

    public get options(): EnumControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: EnumControlOptions) {
        this._options = _.defaults({}, value, DEFAULT);
        this._list = this._options.enum;
    }
}

@NgModule({
    imports: [
        XmTranslationModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatIconModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
    ],
    exports: [XmEnumControl],
    declarations: [XmEnumControl],
    providers: [],
})
export class XmEnumControlModule {
    public entry: IControlFn<string, EnumControlOptions> = XmEnumControl;
}
