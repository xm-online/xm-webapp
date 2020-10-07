import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IControlFn } from '@xm-ngx/dynamic';

import * as _ from 'lodash';

import { Translate, XmTranslationModule } from '@xm-ngx/translation';

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
            <mat-select [(ngModel)]="value"
                        [disabled]="disabled"
                        (ngModelChange)="change($event)"
                        [placeholder]="options?.title | translate">
                <mat-option *ngFor="let s of _list" [value]="s.value">
                    <mat-icon *ngIf="s.icon">{{s.icon}}</mat-icon>
                    {{s.title | translate}}
                </mat-option>
            </mat-select>

            <mat-error *xmControlErrors="ngControl?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumControl extends NgControlAccessor<string> implements IControl<string, EnumControlOptions> {
    @Input() public disabled: boolean;

    public _list: EnumOption[];
    public _options: EnumControlOptions;

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
    ],
    exports: [XmEnumControl],
    declarations: [XmEnumControl],
    providers: [],
})
export class XmEnumControlModule {
    public entry: IControlFn<string, EnumControlOptions> = XmEnumControl;
}
