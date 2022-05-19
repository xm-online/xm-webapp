import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '@xm-ngx/translation';
import { DatePipe } from '@angular/common';

/**
 * Pipe is used to display date formatted to time from date until now
 */
@Pipe({name: 'timeFrom'})
export class TimeFromPipe implements PipeTransform {
    public locale: string;

    constructor(
        private languageService: LanguageService,
    ) {
        this.locale = this.languageService.locale;
    }

    public transform(value: string): string {
        const date = new Date(value);
        const diffSec = (((new Date()).getTime() - date.getTime()) / 1000);
        const diffDays = Math.floor(diffSec / 86400);

        if (!this.locale) {
            this.locale = 'en';
        }

        return diffSec < 60 ? 'Just now' :
            diffSec < 120 ? '1 minute ago' :
                diffSec < 3600 ? Math.floor(diffSec / 60) + ' minutes ago' :
                    diffSec < 7200 ? '1 hour ago' :
                        diffSec < 86400 ? Math.floor(diffSec / 3600) + ' hours ago' :
                            diffDays == 1 ? 'Yesterday' :
                                diffDays < 7 ? diffDays + ' days ago' :
                                    diffDays < 31 ? Math.ceil(diffDays / 7) + ' week(s) ago' :
                                        new DatePipe(this.locale).transform(value);
    }
}
