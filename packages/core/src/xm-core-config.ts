import { inject, Injectable, InjectionToken } from '@angular/core';
import { ACCOUNT_URL } from '../injection-tokens/auth';

export const XM_CORE_EXTERNAL_CONFIG = new InjectionToken<XmCoreConfig>('XM_CORE_EXTERNAL_CONFIG');

@Injectable({providedIn: 'root'})
export class XmCoreConfig {
    private accountUrl: string = inject(ACCOUNT_URL);

    public SERVER_API_URL: string = '';
    public IDP_PUBLIC_CONFIG_URL: string = `${this.SERVER_API_URL}config/api/profile/webapp/public/idp-config-public.yml?toJson&processed=true`;
    public UI_PUBLIC_CONFIG_URL: string = `${this.SERVER_API_URL}config/api/profile/webapp/settings-public.yml?toJson&processed=true`;
    public UI_PRIVATE_CONFIG_URL: string = `${this.SERVER_API_URL}config/api/profile/webapp/settings-private.yml?toJson&processed=true`;
    public UI_PUBLIC_TRANSLATIONS: string = `${this.SERVER_API_URL}config/api/profile/webapp/public/translations`;
    public UI_PRIVATE_CONFIG_PERMISSION: string = 'CONFIG.CLIENT.WEBAPP.GET_LIST.ITEM';
    public USER_URL: string = `${this.SERVER_API_URL}${this.accountUrl}`;
    public IS_PRODUCTION: boolean = false;
    public IDP_CLIENT_KEY: string = '';
    public IDP_SERVER_API_URL: string = '';
    public VERSION: string = '';
    public RELEASE: string = '';
    /**
     * When enabled, browser tabs coordinate token refresh across each other:
     * a single leader tab owns the proactive refresh timer and the actual
     * refresh network call is single-flight (via the Web Locks API).
     * Prevents concurrent/duplicate refreshes that break single-session backends.
     * Defaults to false to preserve the legacy per-tab behavior.
     */
    public SINGLE_SESSION_TAB_SYNC: boolean = false;
}
