import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { template } from 'lodash/fp';
import { formatDate } from '@angular/common';
import {
    XmDateRangeControlConfig,
    XmDateRangeControlValue,
    XmDateRangeValueOrString
} from './xm-date-range-control';

@Injectable()
export class TransformDateStringCodec {

    public constructor(
        private config: XmDateRangeControlConfig,
        private locale: string,
    ) {
    }

    public toModel(value: XmDateRangeValueOrString): XmDateRangeControlValue {
        if (typeof value === 'string') {
            if (!this.config?.transform) {
                return {
                    from: null,
                    to: null,
                };
            }

            const [from, to] = value
                ?.split(` ${this.getSeparator()} `)
                ?.map(x => _.trim(x, this.buildQuotedString(' ')));

            if (_.isEmpty(from) && _.isEmpty(to)) {
                return {
                    from: null,
                    to: null,
                };
            }

            const { from: normalizeFrom, to: normalizeTo } = this.normalizeDates({ from, to });

            return {
                from: new Date(normalizeFrom),
                to: new Date(normalizeTo),
            };
        }

        return value;
    }

    public fromModel(dates: XmDateRangeControlValue): string {
        if (!this.config?.transform) {
            return '';
        }

        const templateFn = template(this.buildQuotedString('${from} ' + this.getSeparator() + ' ${to}'));

        if (templateFn) {
            return templateFn(this.normalizeDates(dates));
        }

        return '';
    }

    private buildQuotedString(str: string): string {
        const { quotes: [prepend, append] } = this.config.transform;

        return `${prepend}${str}${append}`;
    }

    private normalizeDates({ from, to }: XmDateRangeControlValue): XmDateRangeControlValue {
        if (this.config.format === 'timestamp') {
            const fromFormat = formatDate(from, 'shortDate', 'en');
            const toFormat = formatDate(to, 'shortDate', 'en');

            return {
                from: new Date(fromFormat).getTime(),
                to: new Date(toFormat).getTime(),
            };
        }

        const fromFormat = formatDate(from, this.config.format, this.locale);
        const toFormat = formatDate(to, this.config.format, this.locale);

        return {
            from: fromFormat,
            to: toFormat,
        };
    }

    private getSeparator(): string {
        const { separator } = this.config.transform;
        return separator;
    }
}
