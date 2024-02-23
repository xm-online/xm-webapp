import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationObject } from '@xm-ngx/administration/translations/services/translation.model';

@Injectable({
    providedIn: 'root',
})
export class TranslationConfigService {
    private resourceUrl: string = 'config/api/profile/webapp/public/translations';

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public loadConfigTranslations(lang: string): Observable<TranslationObject> {
        return this.httpClient.get<TranslationObject>(this.resourceUrl + `/${lang}.json`);
    }

    public updateConfigTranslations(configContent: TranslationObject|string, lang: string): Observable<any> {
        return this.httpClient.put(this.resourceUrl + `/${lang}.json`, configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    private headers(): any {
        return {headers: new HttpHeaders({'Content-Type': 'text/plain'})};
    }

    public setToObject(obj: TranslationObject, prop: string, value: any): TranslationObject | string {
        const keys = prop.split('.');
        let current: TranslationObject | string = obj;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const isLastKey = i === keys.length - 1;
            if (isLastKey && current.hasOwnProperty(key) && typeof current[key] === 'object' && Object.keys(current[key]).length > 0) {
                return current;
            }
            if (!isLastKey) {
                if (typeof current[key] !== 'object' || Array.isArray(current[key]) || Object.keys(current[key]).length === 0) {
                    current[key] = {};
                }
                current = current[key];
            } else {
                current[key] = value;
            }
        }
        return obj;
    }

    public deleteFromObject(translation: TranslationObject | string, prop: string): TranslationObject | string {
        const index = prop.indexOf('.');
        if (index > -1) {
            const parentObj = prop.substring(0, index);
            if (translation[parentObj] !== undefined) {
                this.deleteFromObject(translation[parentObj], prop.substr(index + 1));
            }
        } else {
            if (translation[prop] !== undefined) {
                delete translation[prop];
            }
        }
        return translation;
    }
}
