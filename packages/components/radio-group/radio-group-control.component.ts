import { ChangeDetectionStrategy, Component, Input, Optional, ViewEncapsulation } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/interfaces';
import { Translate } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';
import { HintText } from '@xm-ngx/components/hint';
import { NgControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

export type XmRadioValue = boolean | string | number;
export type XmRadioLayout = 'stack' | 'line';

export interface XmRadioControlOptions extends DataQa {
    id?: string;
    title: Translate;
    layout: XmRadioLayout;
    required?: boolean;
    items: XmRadioControlOptionsItem[];
    hint?: HintText;
}

export interface XmRadioControlOptionsItem {
    title: Translate;
    value: XmRadioValue;
    permission?: boolean | string | string[]
}

export const XM_RADIO_CONTROL_OPTIONS_DEFAULT: XmRadioControlOptions = {
    title: '',
    items: [],
    required: false,
    layout: 'line',
    hint: null,
    dataQa: 'radio-group-control',
};

@Component({
    selector: 'xm-radio-group-control',
    template: `
        <mat-radio-group
            [ngModel]="value"
            [ngClass]="{
                'xm-radio-group--line': config.layout === 'line',
                'xm-radio-group--stack': config.layout === 'stack'
            }"
            (change)="radioChange($event)">
            <ng-container *ngFor="let item of config.items">
                <mat-radio-button
                    class="xm-radio-button"
                    color="primary"
                    [value]="item.value"
                    *xmPermission="item.permission">
                    {{item?.title | translate}}
                </mat-radio-button>
            </ng-container>
        </mat-radio-group>

        <mat-error *xmControlErrors="ngControl?.errors; message as message">{{message}}</mat-error>
    `,
    styleUrls: ['./radio-group-control.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    host: {
        class: 'xm-radio-group',
    },
})
export class XmRadioGroupControlComponent extends NgControlAccessor<XmRadioValue> implements XmDynamicControl<XmRadioValue, XmRadioControlOptions> {
    private _config: XmRadioControlOptions = clone(XM_RADIO_CONTROL_OPTIONS_DEFAULT);

    public get value(): XmRadioValue {
        return this._value;
    }

    @Input()
    public set value(value: XmRadioValue) {
        this._value = value;
    }

    public get config(): XmRadioControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmRadioControlOptions) {
        this._config = defaults({}, value, XM_RADIO_CONTROL_OPTIONS_DEFAULT);
    }

    constructor(@Optional() public ngControl: NgControl) {
        super(ngControl);
    }

    public radioChange(radio: MatRadioChange): void {
        super.change(radio.value);
    }
}
