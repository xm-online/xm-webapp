import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { XmDynamicPresentation, } from '@xm-ngx/dynamic';
import { XM_DATE_CONFIG_DEFAULT, XmDateConfig, XmDateValue } from '@xm-ngx/components/date';
import { Defaults } from '@xm-ngx/operators';

export interface XmDateRangeConfig extends XmDateConfig {
    separator: string;
}

export type XmDateRangeValue = [XmDateValue, XmDateValue];

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
        {{ value[0] | date : config.format : config.timezone : config.locale }}{{config.separator}}{{ value[1] | date : config.format : config.timezone : config.locale }}
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateRangeComponent implements XmDynamicPresentation<XmDateRangeValue, XmDateRangeConfig> {
    @Input() @Defaults([]) public value: XmDateRangeValue;
    @Input() @Defaults(XM_DATE_RANGE_CONFIG_DEFAULT) public config: XmDateRangeConfig;
}
