import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Principal } from '@xm-ngx/core/user';
import { LanguageService, Translate } from '../services/language.service';

@Pipe({standalone: false, name: 'i18nName'})
export class I18nNamePipe implements PipeTransform {

    private translateService: TranslateService = inject(TranslateService);
    private langService: LanguageService = inject(LanguageService);
    private principal: Principal = inject(Principal);

    public transform(name: any | { trKey: Translate }, principal: Principal = this.principal): string {
        const langKey = principal.getLangKey() || this.langService.locale;
        if (name && name.trKey) {
            return this.translateService.instant(name.trKey);
        } else if (name && name[langKey]) {
            return name[langKey];
        } else if (name && name.en) {
            return name.en;
        }
        return name;

    }
}
