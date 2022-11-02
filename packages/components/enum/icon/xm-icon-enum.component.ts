import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { keyBy, mapValues } from 'lodash';
import { XmEnumValue } from '../value/xm-enum.component';

type Icons = { [value: string]: string };

export interface XmIconEnumOptionsItem {
    icon: string;
    value: XmEnumValue;
}

export interface XmIconEnumOptions {
    items: XmIconEnumOptionsItem[];
}

@Component({
    selector: 'xm-icon-enum',
    template: `
        <mat-icon>{{(icons[value + ''] || value)}}</mat-icon>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmIconEnumComponent implements XmDynamicPresentation<XmEnumValue, XmIconEnumOptions> {
    @Input() public value: XmEnumValue;

    public icons: Icons = {};
    private _config: XmIconEnumOptions = { items: [] };

    public get config(): XmIconEnumOptions {
        return this._config;
    }

    @Input()
    public set config(config: XmIconEnumOptions) {
        if (config?.items) {
            this.icons = mapValues(keyBy(config.items, 'value'), 'icon');
        }
        this._config = config;
    }
}

