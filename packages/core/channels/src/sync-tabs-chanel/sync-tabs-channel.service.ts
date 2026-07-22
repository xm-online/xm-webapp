import { inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { AUTH_SYNC_CHANNEL_ID, AUTH_SYNC_CHANNEL_NAME } from '@xm-ngx/core/auth';
import { XmSessionService } from '@xm-ngx/core';
import { AUTH_LOGOUT, AuthSyncMessage } from './sync-tabs-channel.model';
import { BroadcastChannelService } from '../broadcast-channel.service';

@Injectable({
    providedIn: 'root',
})
export class SyncTabsChannelService {
    private ngZone: NgZone = inject(NgZone);
    private localStorage: LocalStorageService = inject(LocalStorageService);
    private sessionStorage: SessionStorageService = inject(SessionStorageService);
    private sessionService: XmSessionService = inject(XmSessionService);
    private channelService: BroadcastChannelService = inject(BroadcastChannelService);
    private router: Router = inject(Router);


    public initialize(): void {
        this.channelService.connect(AUTH_SYNC_CHANNEL_NAME);
        this.channelService.onMessage<AuthSyncMessage>(
            AUTH_SYNC_CHANNEL_NAME,
            this.handleMessage.bind(this),
        );
    }

    private handleMessage({type, payload}: AuthSyncMessage): void {
        this.ngZone.run(() => {
            const {id, rememberMe, jwt} = payload || {};

            if (this.isMessageFromSelf(id)) {
                return;
            }

            if (type === AUTH_LOGOUT) {
                this.executeLogout();
                return;
            }

            if (!rememberMe) {
                return;
            }

            this.storeAuthToken(type, jwt);
        });
    }

    private isMessageFromSelf(messageId: string): boolean {
        return messageId === AUTH_SYNC_CHANNEL_ID;
    }

    private executeLogout(): void {
        this.sessionService.clear();
        this.router.navigate(['']);
    }

    private storeAuthToken(type: string, jwt: string): void {
        this.sessionStorage.store(type, jwt);
        this.localStorage.store(type, jwt);
    }
}
