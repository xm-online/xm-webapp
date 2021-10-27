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
    private _options: XmIconEnumOptions = { items: [] };

    public get options(): XmIconEnumOptions {
        return this._options;
    }

    @Input()
    public set options(options: XmIconEnumOptions) {
        if (options?.items) {
            this.icons = mapValues(keyBy(options.items, 'value'), 'icon');
        }
        this._options = options;
    }
}

