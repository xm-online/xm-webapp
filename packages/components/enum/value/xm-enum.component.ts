import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { keyBy, mapValues } from 'lodash';

type Titles = { [value: string]: Translate } | Translate[];

export type XmEnumValue = boolean | string | number;

export interface XmEnumOptionsItem {
    title: Translate;
    value: XmEnumValue;
}

export interface XmEnumOptions {
    /** @deprecated use {@link items} instead */
    titles?: Titles;
    items: XmEnumOptionsItem[];
}

@Component({
    selector: 'xm-enum',
    template: `
        {{(titles[value + ''] || value) | translate}}
    `,
    imports: [XmTranslationModule],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumComponent implements XmDynamicPresentation<XmEnumValue, XmEnumOptions> {
    @Input() public value: XmEnumValue;

    public titles: Titles = {};
    private _config: XmEnumOptions = { items: [] };

    public get config(): XmEnumOptions {
        return this._config;
    }

    @Input()
    public set config(config: XmEnumOptions) {
        if (config?.titles) {
            this.titles = config?.titles;
            console.warn('"titles" is deprecated use "items" instead!');
        } else if (config?.items) {
            this.titles = mapValues(keyBy(config.items, 'value'), 'title');
        }
        this._config = config;
    }
}

