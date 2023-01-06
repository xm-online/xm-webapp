import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService, TranslatePipe } from '@xm-ngx/translation';
import { DatePipe } from '@angular/common';

/**
 * Pipe is used to display date formatted to time from date until now
 */
@Pipe({name: 'timeFrom'})
export class TimeFromPipe implements PipeTransform {
    public locale: string;

    constructor(
        private translate: TranslatePipe,
        private languageService: LanguageService,
    ) {
        this.locale = this.languageService.locale;
    }

    public transform(value: string): string {
        const date = new Date(value);
        const diffSec = (((new Date()).getTime() - date.getTime()) / 1000);
        const nextDay = new Date().getDay() - date.getDay();
        const diffDays = Math.floor(diffSec / 86400);

        if (!this.locale) {
            this.locale = 'en';
        }

        return diffSec < 60 ? this.translate.transform('time.now') :
            diffSec < 120 ? this.translate.transform('time.minAgo') :
                diffSec < 3600 ? Math.floor(diffSec / 60) + this.translate.transform('time.minsAgo') :
                    diffSec < 7200 ? this.translate.transform('time.hourAgo') :
                        diffSec < 86400 ? Math.floor(diffSec / 3600) + this.translate.transform('time.hoursAgo') :
                            (diffDays == 1 && nextDay == 1) ? this.translate.transform('time.yesterday') :
                                diffDays < 7 ? diffDays + this.translate.transform('time.daysAgo') :
                                    diffDays < 31 ? Math.ceil(diffDays / 7) + this.translate.transform('time.weeksAgo') :
                                        new DatePipe(this.locale).transform(value);
    }
}
