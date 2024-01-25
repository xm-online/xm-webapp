import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '@xm-ngx/translation';
import * as _ from 'lodash';

import { dayjs } from '@xm-ngx/operators';

import { Principal } from '@xm-ngx/core/user';
import { XmConfigService } from '@xm-ngx/core/config';

/**
 * Pipe is used to display formatted date
 * It accepts two optional params: format?: string (dayjs) and offset?: string
 * If used without params, would be taken from account in Principal
 * and formating also can be override from config UI
 */
@Pipe({name: 'xmDateTime', standalone: true})
export class XmDateTimePipe implements PipeTransform {

    public account: {
        langKey: string;
        timeZoneOffset: string;
    };
    public locale: string;
    public dicFormats: any;
    public dicFormatsConfig: any;

    constructor(private principal: Principal,
                private languageService: LanguageService,
                private xmConfigService: XmConfigService) {
        this.locale = this.languageService.locale;
        this.principal.identity().then((account) => this.account = _.defaultsDeep(account, {langKey: 'en'}));
        this.dicFormats = {en: 'MM/DD/YYYY HH:mm', ru: 'DD.MM.YYYY HH:mm', uk: 'DD.MM.YYYY HH:mm'};
        this.xmConfigService.getUiConfig().subscribe((resp) => this.dicFormatsConfig = resp.datesFormats || {});
    }

    public transform(time: any, format?: string, offset?: string): any {
        const timeDayjs = dayjs(time).utc().utcOffset(offset ? offset : this.getOffset());
        return timeDayjs.format(format ? format : this.getDefaultFormat());
    }

    private getOffset(): string {
        return this.principal.getTimezoneOffset();
    }

    private getDefaultFormat(): string {
        const lang = this.locale;
        let format = this.dicFormats.en;
        if (lang in this.dicFormats) {
            format = this.dicFormats[lang];
        }
        if (lang in this.dicFormatsConfig) {
            format = this.dicFormatsConfig[lang];
        }
        return format;
    }
}
