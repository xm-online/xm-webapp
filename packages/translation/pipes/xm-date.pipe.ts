import { inject, Pipe, PipeTransform } from '@angular/core';
import { Principal } from '@xm-ngx/core/user';
import { DatePipe } from '@angular/common';

@Pipe({name: 'xmDate', standalone: true})
export class XmDatePipe implements PipeTransform {
    public locale: string = 'en';

    private xmPrincipalService: Principal = inject(Principal);
    private datePipe: DatePipe = inject(DatePipe);

    public transform(date: string | Date, format?: string, timezone?: string, locale?: string): string | null {
        this.locale = this.xmPrincipalService.getLangKey();
        return this.datePipe.transform(date, format, timezone, locale || this.locale);
    }
}
