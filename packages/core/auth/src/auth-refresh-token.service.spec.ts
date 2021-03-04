import { TestBed } from '@angular/core/testing';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { AuthRefreshTokenService } from './auth-refresh-token.service';

describe('AuthRefreshTokenService', () => {
    let service: AuthRefreshTokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LocalStorageService,
                SessionStorageService,
                AuthRefreshTokenService,
            ],
        });
        service = TestBed.inject<AuthRefreshTokenService>(AuthRefreshTokenService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
