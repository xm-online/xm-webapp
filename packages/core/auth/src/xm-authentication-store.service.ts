import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

export const REFRESH_TOKEN = 'refresh_token';
export const AUTH_TOKEN = 'authenticationToken';

@Injectable()
export class XmAuthenticationStoreService {

    constructor(
        private localStorage: LocalStorageService,
        private sessionStorage: SessionStorageService,
    ) {
    }

    public storeAuthenticationToken(jwt: string, rememberMe: boolean = false): void {
        if (rememberMe) {
            this.localStorage.store(AUTH_TOKEN, jwt);
        }
        this.sessionStorage.store(AUTH_TOKEN, jwt);
    }

    public storeRefreshToken(jwt: string, rememberMe: boolean = false): void {
        if (rememberMe) {
            this.localStorage.store(REFRESH_TOKEN, jwt);
        }
        this.sessionStorage.store(REFRESH_TOKEN, jwt);
    }

    public isRememberMe(): boolean {
        return this.localStorage.retrieve(REFRESH_TOKEN) != null;
    }

    public getAuthenticationToken(): string {
        return this.localStorage.retrieve(AUTH_TOKEN) || this.sessionStorage.retrieve(AUTH_TOKEN);
    }

    public getRefreshToken(): string {
        return this.localStorage.retrieve(REFRESH_TOKEN) || this.sessionStorage.retrieve(REFRESH_TOKEN);
    }

    public clear(): void {
        this.localStorage.clear(AUTH_TOKEN);
        this.sessionStorage.clear(AUTH_TOKEN);
        this.localStorage.clear(REFRESH_TOKEN);
        this.sessionStorage.clear(REFRESH_TOKEN);
    }

}
