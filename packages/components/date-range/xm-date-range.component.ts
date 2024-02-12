import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { XmDynamicPresentation, } from '@xm-ngx/dynamic';
import { XM_DATE_CONFIG_DEFAULT, XmDateConfig, XmDateValue } from '@xm-ngx/components/date';
import { Defaults } from '@xm-ngx/operators';

export interface XmDateRangeConfig extends XmDateConfig {
    separator: string;
}

export type XmDateRangeValue = { from: XmDateValue, to: XmDateValue };

export const XM_DATE_RANGE_CONFIG_DEFAULT: XmDateRangeConfig = {
    ...XM_DATE_CONFIG_DEFAULT,
    separator: '-',
};

@Component({
    selector: 'xm-date-range',
    imports: [
        DatePipe,
    ],
    standalone: true,
    template: `
        {{ date.from | date : config.format : config.timezone : config.locale }}{{config.separator}}{{ date.to | date : config.format : config.timezone : config.locale }}
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
        const [from, to] = str?.split('TO');
        this.date = {
            from,
            to
        };
    };
}
