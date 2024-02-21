import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { XmLanguageUiConfig } from '@xm-ngx/administration/translations';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TranslationConfigService {
    private resourceUrl: string = 'config/api/profile/webapp/public/translations';

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public loadConfig(lang: string): Observable<XmLanguageUiConfig> {
        return this.httpClient.get<XmLanguageUiConfig>(this.resourceUrl + `/${lang}.json`);
    }

    public updateConfig(configContent: string, lang: string): Observable<any> {
        return this.httpClient.put(this.resourceUrl + `/${lang}.json`, configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    private headers(): any {
        return {headers: new HttpHeaders({'Content-Type': 'text/plain'})};
    }
}
