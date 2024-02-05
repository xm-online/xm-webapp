import { DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component, inject,
    Input,
    ViewEncapsulation,
    OnInit
} from '@angular/core';
import { XmDynamicPresentation, } from '@xm-ngx/dynamic';
import { XM_DATE_CONFIG_DEFAULT, XmDateConfig, XmDateValue } from '@xm-ngx/components/date';
import { Defaults } from '@xm-ngx/operators';
import { XmUserService } from '@xm-ngx/core/user';
import { take } from 'rxjs/operators';

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
        {{ value.from | date : config.format : config.timezone : (config.locale || locale) }}{{config.separator}}{{ value.to | date : config.format : config.timezone : (config.locale || locale) }}
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateRangeComponent implements XmDynamicPresentation<XmDateRangeValue, XmDateRangeConfig>, OnInit {
    @Input() @Defaults({from: '', to: ''}) public value: XmDateRangeValue;
    @Input() @Defaults(XM_DATE_RANGE_CONFIG_DEFAULT) public config: XmDateRangeConfig;
    public locale: string = 'en';

    private xmUserService: XmUserService = inject(XmUserService);

    public ngOnInit(): void {
        this.xmUserService.user$()
            .pipe(
                take(1)
            )
            .subscribe((user) => {
                this.locale = user.langKey;
            });
    }
}
