import { DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnChanges,
    signal,
    SimpleChanges,
    ViewEncapsulation,
    WritableSignal,
} from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Defaults } from '@xm-ngx/operators';
import dayjs from 'dayjs';

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
    imports: [],
    standalone: true,
    template: `
        <span [attr.data-qa]="config?.dataQa">{{ $value() }}</span>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateComponent implements XmDynamicPresentation<XmDateValue, XmDateConfig>, OnChanges {
    private datePipe = inject(DatePipe);
    public $value: WritableSignal<string> = signal('');
    @Input() public value: XmDateValue;
    @Input() @Defaults(XM_DATE_CONFIG_DEFAULT) public config: XmDateConfig;

    public ngOnChanges(changes: SimpleChanges): void {
        const value: string = changes?.value?.currentValue;
        if (!value) {
            return;
        }
        const isValidDate: boolean = dayjs(value).isValid();
        if (!isValidDate) {
            this.$value.set(value);
            return;
        }

        const {format, locale, timezone} = this.config || XM_DATE_CONFIG_DEFAULT;
        const formattedDate: string = this.datePipe.transform(value, format, timezone, locale);

        this.$value.set(formattedDate);
    }
}
