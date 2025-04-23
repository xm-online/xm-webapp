import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { XmAuthenticationStoreService } from './xm-authentication-store.service';
import { GuestTokenResponse } from './guest-token.response';
import { AuthTokenResponse } from './auth-token.response';
import { XmAuthenticationConfig } from './xm-authentication-config.service';
import { TOKEN_URL } from '@xm-ngx/core/user';

const DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const DEFAULT_AUTH_TOKEN = 'Basic d2ViYXBwOndlYmFwcA==';

@Injectable()
export class XmAuthenticationRepository {
    private TOKEN_URL: string = inject(TOKEN_URL);

    constructor(
        private httpClient: HttpClient,
        private authenticationConfig: XmAuthenticationConfig,
        private storeService: XmAuthenticationStoreService,
    ) {
    }

    public refreshToken(): Observable<AuthTokenResponse> {
        const headers = {
            Authorization: DEFAULT_AUTH_TOKEN,
            'Content-Type': DEFAULT_CONTENT_TYPE,
            Accept: 'application/json',
        };

        const body = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('refresh_token', this.storeService.getRefreshToken());

        return this.httpClient.post<AuthTokenResponse>(this.authenticationConfig.tokenUrl, body, {headers});
    }


    public refreshGuestAccessToken(): Observable<GuestTokenResponse> {
        const data = new HttpParams().set('grant_type', 'client_credentials');
        const headers = {
            'Content-Type': DEFAULT_CONTENT_TYPE,
            Authorization: DEFAULT_AUTH_TOKEN,
        };
        return this.httpClient.post<GuestTokenResponse>(
            this.TOKEN_URL,
            data,
            {headers},
        );
    }
}
