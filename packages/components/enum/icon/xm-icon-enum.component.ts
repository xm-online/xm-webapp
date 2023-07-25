import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { keyBy, mapValues } from 'lodash';
import { XmEnumValue } from '../value/xm-enum.component';
import { MatIconModule } from '@angular/material/icon';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';

interface IEntity<T> {
    [key: string]: T;
}
type Icons = IEntity<string>;
type Tooltips = IEntity<Translate>;

export interface XmIconEnumOptionsItem {
    icon: string;
    value: XmEnumValue;
    tooltip?: Translate;
}

export interface XmIconEnumOptions {
    items: XmIconEnumOptionsItem[];
    showTooltipDelay?: number;
    tooltipPosition?: TooltipPosition;
}

@Component({
    selector: 'xm-icon-enum',
    template: `
        <mat-icon
            [matTooltip]="tooltips[value + ''] | translate"
            [matTooltipShowDelay]="config?.showTooltipDelay"
            [matTooltipPosition]="config?.tooltipPosition"
            >{{ icons[value + ''] || value }}</mat-icon
        >
    `,
    imports: [MatIconModule, XmTranslationModule, MatTooltipModule],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmIconEnumComponent implements XmDynamicPresentation<XmEnumValue, XmIconEnumOptions> {
    @Input() public value: XmEnumValue;

    public icons: Icons = {};
    public tooltips: Tooltips = {};
    private _config: XmIconEnumOptions = { items: [] };

    public get config(): XmIconEnumOptions {
        return this._config;
    }

    @Input()
    public set config(config: XmIconEnumOptions) {
        if (config?.items) {
            this.icons = mapValues(keyBy(config.items, 'value'), 'icon');
            this.tooltips = mapValues(keyBy(config.items, 'value'), 'tooltip');
        }
        this._config = config;
    }
}
