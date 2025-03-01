import { inject, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Principal } from '@xm-ngx/core/user';

@Pipe({name: 'xmDate', standalone: true})
export class XmDatePipe implements PipeTransform {
    public locale: string = 'en';

    private xmPrincipalService: Principal = inject(Principal);
    private datePipe: DatePipe = inject(DatePipe);

    public transform(date: string | Date, format?: string, timezone?: string, locale?: string): string | null {
        if (!date) {
            return null;
        }
        if (!this.isDateValid(date)) {
            return null;
        }
        this.locale = this.xmPrincipalService.getLangKey();
        return this.datePipe.transform(date, format, timezone, locale || this.locale);
    }

    private isDateValid(dateStr: string | Date): boolean {
        return !isNaN(new Date(dateStr) as any);
    }
}
