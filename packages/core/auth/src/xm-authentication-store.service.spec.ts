import { TestBed } from '@angular/core/testing';

import { XmAuthenticationStoreService } from './xm-authentication-store.service';

describe('XmAuthenticationStoreService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: XmAuthenticationStoreService = TestBed.inject(XmAuthenticationStoreService);
        expect(service).toBeTruthy();
    });
});
