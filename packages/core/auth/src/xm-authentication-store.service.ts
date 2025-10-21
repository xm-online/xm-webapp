import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import {
    AUTH_SYNC_CHANNEL_ID,
    AUTH_SYNC_CHANNEL_NAME,
    AUTH_TOKEN,
    IDP_CLIENT,
    REFRESH_TOKEN,
} from './xm-authentication-store.constants';

@Injectable()
export class XmAuthenticationStoreService {
    private channelId = AUTH_SYNC_CHANNEL_ID;
    private channel: BroadcastChannel;


    constructor(
        private localStorage: LocalStorageService,
        private sessionStorage: SessionStorageService,
    ) {
        this.setBroadcastChannelConfiguration();
    }

    public storeAuthenticationToken(jwt: string, rememberMe: boolean = false): void {
        this.channel.postMessage({type: AUTH_TOKEN, payload: {jwt, rememberMe, id: this.channelId}});
        if (rememberMe) {
            this.localStorage.store(AUTH_TOKEN, jwt);
        }
        this.sessionStorage.store(AUTH_TOKEN, jwt);
    }

    public storeRefreshToken(jwt: string, rememberMe: boolean = false): void {
        this.channel.postMessage({type: REFRESH_TOKEN, payload: {jwt, rememberMe, id: this.channelId}});
        if (rememberMe) {
            this.localStorage.store(REFRESH_TOKEN, jwt);
        }
        this.sessionStorage.store(REFRESH_TOKEN, jwt);
    }

    public isRememberMe(): boolean {
        return this.localStorage.retrieve(REFRESH_TOKEN) != null;
    }

    public getAuthenticationToken(): string {
        return this.sessionStorage.retrieve(AUTH_TOKEN) || this.localStorage.retrieve(AUTH_TOKEN);
    }

    public hasAuthenticationToken(): boolean {
        return !!this.getAuthenticationToken();
    }

    public hasRefreshToken(): boolean {
        return !!this.getRefreshToken();
    }

    public getRefreshToken(): string {
        return this.sessionStorage.retrieve(REFRESH_TOKEN) || this.localStorage.retrieve(REFRESH_TOKEN);
    }

    private setBroadcastChannelConfiguration(): void {
        this.channel = new BroadcastChannel(AUTH_SYNC_CHANNEL_NAME);
    }

    public clear(saveIdpConfig?: boolean): void {
        this.localStorage.clear(AUTH_TOKEN);
        this.sessionStorage.clear(AUTH_TOKEN);
        this.localStorage.clear(REFRESH_TOKEN);
        this.sessionStorage.clear(REFRESH_TOKEN);
        if (!saveIdpConfig) {
            this.localStorage.clear(IDP_CLIENT);
            this.sessionStorage.clear(IDP_CLIENT);
        }
    }
}
