import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Defaults } from '@xm-ngx/operators';

export interface XmDateConfig {
    format?: string;
    timezone?: string;
    locale?: string;
    dataQa?: string;
}

export type ISODate = string;

export type XmDateValue = ISODate | Date;

export const XM_DATE_CONFIG_DEFAULT: XmDateConfig = {};

@Component({
    selector: 'xm-date',
    imports: [
        DatePipe,
    ],
    standalone: true,
    template: `
        <span [attr.data-qa]="config?.dataQa">
            {{ value | date : config.format : config.timezone : config.locale }}
        </span>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateComponent implements XmDynamicPresentation<XmDateValue, XmDateConfig> {
    @Input() public value: XmDateValue;
    @Input() @Defaults(XM_DATE_CONFIG_DEFAULT) public config: XmDateConfig;
}
