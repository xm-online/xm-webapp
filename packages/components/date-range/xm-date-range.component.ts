import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { XmDynamicPresentation, } from '@xm-ngx/dynamic';
import { XM_DATE_CONFIG_DEFAULT, XmDateConfig, XmDateValue } from '@xm-ngx/components/date';
import { Defaults } from '@xm-ngx/operators';
import { XmDatePipe } from '@xm-ngx/translation';

export interface XmDateRangeConfig extends XmDateConfig {
    separator: string;
    splitSeparator?: string;
}

export type XmDateRangeValue = { from: XmDateValue, to: XmDateValue };

export const XM_DATE_RANGE_CONFIG_DEFAULT: XmDateRangeConfig = {
    ...XM_DATE_CONFIG_DEFAULT,
    separator: '-',
    splitSeparator: 'TO'
};

@Component({
    selector: 'xm-date-range',
    imports: [
        XmDatePipe,
    ],
    standalone: true,
    template: `
        {{ date.from | xmDate : config.format : config.timezone : config.locale }}{{config.separator}}{{ date.to | xmDate : config.format : config.timezone : config.locale }}
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateRangeComponent implements XmDynamicPresentation<XmDateRangeValue, XmDateRangeConfig> {
    @Input() @Defaults(XM_DATE_RANGE_CONFIG_DEFAULT) public config: XmDateRangeConfig;
    public date: XmDateRangeValue;
    @Input()
    public set value(value: XmDateRangeValue) {
        if (value?.from && value?.to) {
            this.date = value;
            return;
        }
        const str = String(value)?.replace(/\[|\]/g, '');
        const [from, to] = str?.split(this.config.splitSeparator);
        this.date = {
            from,
            to
        };
    };
}
