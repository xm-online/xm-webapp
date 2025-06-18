import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { XmDynamicModule, XmDynamicPresentation, XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { keyBy, mapValues } from 'lodash';

type Titles = { [value: string]: {title: Translate; style?: string; } } | Translate[];

export type XmEnumValue = boolean | string | number;

export interface XmEnumOptionsItem {
    title: Translate;
    value: XmEnumValue;
    style?: string;
}

export interface XmEnumOptions {
    /** @deprecated use {@link items} instead */
    titles?: Titles;
    dataQa?: string;
    items: XmEnumOptionsItem[];
    layout?: XmDynamicPresentationLayout;
}

@Component({
    selector: 'xm-enum',
    template: `
        <span [attr.data-qa]="config?.dataQa">
            @if (config?.layout?.selector) {
                <ng-container
                        xmDynamicPresentation
                        [value]="(titles?.[value + '']?.title || titles?.[value + ''] || value) | translate"
                        [class]="config?.layout?.class"
                        [style]="config?.layout?.style"
                        [selector]="config.layout.selector"
                        [config]="config?.layout?.config">
            </ng-container>
            } @else {
                <span [style]="titles[value + '']?.style">
                    {{(titles?.[value + '']?.title || titles?.[value + ''] || value) | translate }}
                </span>
            }
        </span>
    `,
    imports: [XmTranslationModule, XmDynamicModule],
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
            this.titles = mapValues(
                keyBy(config.items, 'value'),
                item => ({ title: item.title, style: item.style }));
        }
        this._config = config;
    }
}

