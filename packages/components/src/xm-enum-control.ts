import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgModelWrapper } from '@xm-ngx/components/ng-model-wrapper';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';

export interface IEnumFilterList {
    title: string;
    value: string;
    icon?: string;
}

@Component({
    selector: 'xm-enum-control',
    template: `
        <mat-form-field>
            <mat-select [(ngModel)]="value"
                        [disabled]="disabled"
                        (ngModelChange)="change($event)"
                        [placeholder]="options?.title | translate">
                <mat-option *ngFor="let s of _list" [value]="s.value">
                    <mat-icon [hidden]="!s.icon"> {{s.icon}}</mat-icon>
                    {{s.title | translate}}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `,
    providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => XmEnumControl), multi: true}],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumControl extends NgModelWrapper<string> implements IControl<string, IEnumFilterList> {
    @Input() public disabled: boolean;
    @Input() public options: IEnumFilterList;

    public _list: IEnumFilterList[];

    @Input()
    public set list(value: string[] | IEnumFilterList[]) {
        if (value && typeof value[0] === 'string') {
            this._list = _.map<string, IEnumFilterList>(value as string[], (i: string) => ({title: i, value: i}));
        } else {
            this._list = value as IEnumFilterList[];
        }
    }
}

@NgModule({
    imports: [XmTranslationModule, MatFormFieldModule, MatSelectModule, FormsModule, MatIconModule, CommonModule],
    exports: [XmEnumControl],
    declarations: [XmEnumControl],
    providers: [],
})
export class XmEnumControlModule {
    public entry: IControlFn<string, IEnumFilterList> = XmEnumControl;
}
