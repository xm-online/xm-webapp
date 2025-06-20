import { Pipe, PipeTransform } from '@angular/core';
import { Principal } from '@xm-ngx/core/user';

import { I18nNamePipe } from './i18n-name.pipe';

@Pipe({standalone: false, name: 'i18nJsf'})
export class I18nJsfPipe implements PipeTransform {

    constructor(private pipe: I18nNamePipe,
                private principal: Principal) {
    }

    public transform(formOrLayoutOrOptions: any, principal: Principal = this.principal): any {
        return this.transformTitles(formOrLayoutOrOptions, principal);
    }

    public transformTitles(obj: any, principal: Principal): any {
        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (property === 'validationMessages') {
                    this.transformValidationMessages(obj[property], principal);
                } else if (typeof obj[property] === 'object' && !this.fieldsToTranslate(property)) {
                    this.transformTitles(obj[property], principal);
                } else {
                    if (property === 'title' || property === 'label') {
                        this.setTitle(obj, property, principal);
                    }
                    if (property === 'name' || property === 'helpvalue' || property === 'placeholder') {
                        obj[property] = this.pipe.transform(obj[property], principal);
                    }
                }
            }
        }
        return obj;
    }

    public transformValidationMessages(obj: any, principal: Principal): void {
        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                obj[property] = this.pipe.transform(obj[property], principal);
            }
        }
    }

    private fieldsToTranslate(property: string) {
        return property === 'title' || property === 'label' || property === 'name' || property === 'helpvalue' || property === 'placeholder';
    }

    private setTitle(obj: any, property: string, principal: Principal) {
        if (obj[property] && (obj[property].trKey || Object.keys(obj[property]).filter((it) => it.length !== 2).length === 0)) {
            // assign to title this is not are mistake, from different properties to title
            // reason: title can be only string, for store object we are using label field
            obj.title = this.pipe.transform(obj[property], principal);
        }
    }

}
