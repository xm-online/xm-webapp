import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

import * as _ from 'lodash';
import { XmPermissionModule } from '@xm-ngx/core/permission';

export interface EnumControlOptions {
    id?: string;
    title?: Translate;
    required?: boolean;
    enum: EnumOption[]
}

export interface EnumOption {
    title: Translate;
    value?: string;
    icon?: string;
    permissions?: string[];
}

const DEFAULT: EnumControlOptions = {
    title: '',
    required: false,
    enum: [],
};

@Component({
    selector: 'xm-enum-control',
    template: `
        <mat-form-field>
            <mat-select [formControl]="control"
                        [required]="options.required"
                        [id]="options.id"
                        [placeholder]="options?.title | translate">
                <ng-template ngFor [ngForOf]="_list" let-item>
                    <mat-option [value]="item.value" *xmPermission="item.permissions || []">
                        <mat-icon *ngIf="item.icon">{{item.icon}}</mat-icon>
                        {{item.title | translate}}
                    </mat-option>
                </ng-template>
            </mat-select>

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumControl extends NgFormAccessor<string> implements IControl<string, EnumControlOptions> {
    @Input() public control: FormControl = new FormControl();

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
        XmPermissionModule,
    ],
    exports: [XmEnumControl],
    declarations: [XmEnumControl],
})
export class XmEnumControlModule {
    public entry: IControlFn<string, EnumControlOptions> = XmEnumControl;
}
