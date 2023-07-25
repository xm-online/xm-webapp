import { Injectable, InjectionToken } from '@angular/core';

export const XM_CORE_EXTERNAL_CONFIG = new InjectionToken<XmCoreConfig>('XM_CORE_EXTERNAL_CONFIG');

@Injectable({providedIn: 'root'})
export class XmCoreConfig {
    public SERVER_API_URL: string = '';
    public IDP_PUBLIC_CONFIG_URL: string = `${this.SERVER_API_URL}config/api/profile/webapp/public/idp-config-public.yml?toJson&processed=true`;
    public UI_PUBLIC_CONFIG_URL: string = `${this.SERVER_API_URL}config/api/profile/webapp/settings-public.yml?toJson&processed=true`;
    public UI_PRIVATE_CONFIG_URL: string = `${this.SERVER_API_URL}config/api/profile/webapp/settings-private.yml?toJson&processed=true`;
    public UI_PRIVATE_CONFIG_PERMISSION: string = 'CONFIG.CLIENT.WEBAPP.GET_LIST.ITEM';
    public USER_URL: string = `${this.SERVER_API_URL}uaa/api/account`;
    public IS_PRODUCTION: boolean = false;
    public IDP_CLIENT_KEY: string = '';
    public IDP_SERVER_API_URL: string = '';
    public VERSION: string = '';
    public RELEASE: string = '';
}
