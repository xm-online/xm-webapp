import { InjectionToken } from '@angular/core';

export const TOKEN_URL: InjectionToken<string> = new InjectionToken<string>('TOKEN_URL', {
    providedIn: 'root',
    factory: () => 'uaa/oauth/token',
});

export const ACCOUNT_URL: InjectionToken<string> = new InjectionToken<string>('ACCOUNT_URL', {
    providedIn: 'root',
    factory: () => 'uaa/api/account',
});
