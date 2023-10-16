import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PasswordSpec } from './password-spec.model';
import { XmApplicationConfigService } from './xm-config.service';
import { SKIP_ERROR_HANDLER_INTERCEPTOR_HEADER_KEY } from '@xm-ngx/core';

interface IUIConfig {
    logoUrl?: string;
    name?: string;
    iconsInMenu?: string;
}

export type UIConfig = IUIConfig | any;

@Injectable()
export class XmConfigService {

    private configUrl: string = 'config/api/profile';
    private configMaintenanceUrl: string = 'config/api/config';
    private uaaPasswordConfigUrl: string = 'uaa/api/uaa/properties/settings-public';
    private elasticReindexUrl: string = '/entity/api/elasticsearch/index';

    private uiConfig: UIConfig;
    private uiConfigState: AsyncSubject<any> = new AsyncSubject<any>();

    constructor(
        private http: HttpClient,
        private appConfig: XmApplicationConfigService,
    ) {
    }

    public validateTimelineSpec(configContent: string): Observable<any> {
        return this.http.post('timeline/api/timelines/properties/validate', configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    public updateTimelineSpec(configContent: string): Observable<any> {
        return this.http.post('timeline/api/timelines/properties', configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    /** @deprecated use XmEntitySpecService update instead */
    public updateXmEntitySpec(configContent: string): Observable<any> {
        return this.http.post('entity/api/xm-entity-specs', configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    public updateConfig(configPath: string, configContent: string): Observable<any> {
        return this.http.put(this.configUrl + configPath, configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    public updateTenantSpec(configPath: string, configContent: string): Observable<any> {
        return this.http.put(this.configUrl + configPath, configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    public getConfig(configPath: string): Observable<string> {
        return this.http.get(this.configUrl + configPath, {responseType: 'text'}).pipe(
            map((res: any) => res));
    }

    public getPasswordConfig(): Observable<string> {
        return this.http.get(this.uaaPasswordConfigUrl, {responseType: 'text'}).pipe(
            map((res: any) => res));
    }

    public getUiConfigData(): void {
        if (this.uiConfig) {
            this.uiConfigState.next(this.uiConfig);
        } else {
            this.getConfigJson('/webapp/settings-public.yml?toJson&processed=true').subscribe((uiConfig) => {
                this.uiConfigState.next(this.uiConfig = uiConfig);
                this.uiConfigState.complete();
            });
        }
    }

    public getUiConfig(): Observable<UIConfig> {
        return of(this.appConfig.getAppConfig());
    }

    public getConfigJson(configPath: string): Observable<any> {
        return this.http.get(this.configUrl + configPath).pipe(
            map((res: any) => res));
    }

    public getLoginsSpec(): Observable<any> {
        return this.http.get('uaa/api/logins').pipe(
            map((res: any) => res));
    }

    public validateLoginsSpec(configContent: string): Observable<any> {
        return this.http.post('uaa/api/logins/validate', configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    public updateLoginsSpec(configContent: string): Observable<any> {
        return this.http.post('uaa/api/logins', configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    public validateUaaSpec(configContent: string): Observable<any> {
        return this.http.post('uaa/api/uaa/properties/validate', configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    public updateUaaSpec(configContent: string): Observable<any> {
        return this.http.post('uaa/api/uaa/properties', configContent, this.headers()).pipe(
            map((res: any) => res));
    }

    public getUaaDataSchema(roleKey: string): Observable<any> {
        return this.http.get(`uaa/api/uaa/properties/data-schema/${roleKey}`);
    }

    public reindexTenantElastic(): Observable<any> {
        return this.http.post(this.elasticReindexUrl, {});
    }

    public updateTenantsConfig(): Observable<any> {
        // TODO: Fix method to return JSON
        return this.http.post(this.configMaintenanceUrl + '/refresh', {});
    }

    public isUpdateTenantsConfigAvailable(): Observable<{available: boolean}> {
        const headers = {};
        headers[SKIP_ERROR_HANDLER_INTERCEPTOR_HEADER_KEY] = '';
        return this.http.get<{available: boolean}>(this.configMaintenanceUrl + '/refresh/available', { headers });
    }

    public updateTenantConfig(): Observable<any> {
        // TODO: Fix method to return JSON
        return this.http.post(this.configUrl + '/refresh', {});
    }

    public mapPasswordSettings(config?: any): PasswordSpec {
        const DEFAULT_SETTINGS = {
            minLength: 4,
            maxLength: 50,
            pattern: '',
            patternMessage: null,
        };
        if (!config) {return DEFAULT_SETTINGS; }
        const CONFIG_PARSED = JSON.parse(config);
        if (CONFIG_PARSED && CONFIG_PARSED.passwordSettings) {
            const CONFIG: PasswordSpec = CONFIG_PARSED.passwordSettings;
            return {
                minLength: CONFIG.minLength || 4,
                maxLength: CONFIG.maxLength || 50,
                pattern: CONFIG.pattern || '',
                patternMessage: CONFIG.patternMessage || null,
            };
        }
        return DEFAULT_SETTINGS;

    }

    private headers(): any {
        return {headers: new HttpHeaders({'Content-Type': 'text/plain'})};
    }
}
