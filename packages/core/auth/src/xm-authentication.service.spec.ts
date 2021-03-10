import { TestBed } from '@angular/core/testing';
import { XmSessionService } from '@xm-ngx/core';
import { AuthServerProvider, LoginService } from '@xm-ngx/core/auth';

import { XmAuthenticationService } from './xm-authentication.service';

describe('XmAuthenticationService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide: LoginService, useValue: null },
            { provide: AuthServerProvider, useValue: null },
            { provide: XmSessionService, useValue: null },
            XmAuthenticationService,
        ],
    }));

    it('should be created', () => {
        const service: XmAuthenticationService = TestBed.inject<XmAuthenticationService>(XmAuthenticationService);
        expect(service).toBeTruthy();
    });
});
