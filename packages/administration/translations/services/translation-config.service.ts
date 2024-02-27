import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslationObject } from '@xm-ngx/administration/translations/services/translation.model';
import { last, isObject, get, isEmpty, set } from 'lodash';

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

    public updateConfigTranslations(configContent: TranslationObject | string, lang: string): Observable<object> {
        return this.httpClient.put(this.resourceUrl + `/${lang}.json`, configContent, {headers: this.headers()});
    }

    private headers() {
        return new HttpHeaders({'Content-Type': 'text/plain'});
    }

    public setToObject(obj: TranslationObject, prop: string, value: string): TranslationObject {
        const keys = prop.split('.');
        const pathToLastKey = keys.slice(0, -1).join('.');
        const lastKey = last(keys);
        const parentObject = pathToLastKey ? get(obj, pathToLastKey, {}) : obj;
        if (lastKey && isObject(get(parentObject, lastKey)) && !isEmpty(get(parentObject, lastKey))) {
            return obj;
        }
        set(obj, prop, value);
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
